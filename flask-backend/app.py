import os
import sys
import json
import hashlib
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime, timedelta
from collections import defaultdict

load_dotenv()

app = Flask(__name__)
# Allow multiple origins for development flexibility and production
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",  # Docker frontend
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "https://prompt-pal-murex.vercel.app"
]

# Use the environment variable if set, otherwise use the origins list
cors_origin = os.getenv("CORS_ORIGIN")
if cors_origin:
    origins.append(cors_origin)

CORS(app, origins=origins, supports_credentials=True)

# Gemini API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
USE_GEMINI = bool(GEMINI_API_KEY)

if USE_GEMINI:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use gemini-2.5-flash-lite - lightweight and efficient model
    MODEL_NAME = 'gemini-2.5-flash-lite'
    model = genai.GenerativeModel(
        MODEL_NAME,
        generation_config={
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "max_output_tokens": 1024,
        }
    )
    print(f"✓ Gemini API configured successfully (using {MODEL_NAME})")
else:
    MODEL_NAME = None
    print("✗ No Gemini API key found - using fallback smart engine only")

# Rate limiting configuration
RATE_LIMIT_PER_MINUTE = 15  # Gemini free tier limit
rate_limiter = defaultdict(list)

# Simple cache for repeated prompts
prompt_cache = {}
CACHE_TTL = 3600  # 1 hour cache

MIN_SUGGESTION_LENGTH = 50  # Minimum length for a suggestion to be considered valid

def get_cache_key(prompt_text, tags):
    """Generate cache key from prompt content"""
    content = f"{prompt_text}:{','.join(sorted(tags))}"
    return hashlib.md5(content.encode()).hexdigest()

def check_rate_limit(ip_address):
    """Check if IP has exceeded rate limit"""
    now = datetime.now()
    minute_ago = now - timedelta(minutes=1)
    
    # Remove old entries
    rate_limiter[ip_address] = [
        timestamp for timestamp in rate_limiter[ip_address]
        if timestamp > minute_ago
    ]
    
    if len(rate_limiter[ip_address]) >= RATE_LIMIT_PER_MINUTE:
        return False
    
    rate_limiter[ip_address].append(now)
    return True

def analyze_prompt_type(prompt_text, tags):
    """Analyze the prompt to determine its type and context"""
    prompt_lower = prompt_text.lower()
    tag_text = ' '.join(tags).lower()
    
    # Define prompt categories with keywords
    categories = {
        'writing': ['write', 'blog', 'article', 'content', 'story', 'essay', 'post'],
        'creative': ['create', 'design', 'generate', 'imagine', 'creative', 'artistic'],
        'business': ['marketing', 'strategy', 'business', 'campaign', 'plan', 'proposal'],
        'technical': ['code', 'programming', 'technical', 'development', 'system', 'algorithm'],
        'educational': ['explain', 'teach', 'learn', 'tutorial', 'guide', 'instruction'],
        'analysis': ['analyze', 'review', 'evaluate', 'compare', 'research', 'assessment']
    }
    
    # Score each category
    scores = {}
    for category, keywords in categories.items():
        score = sum(1 for keyword in keywords if keyword in prompt_lower or keyword in tag_text)
        if score > 0:
            scores[category] = score
    
    # Return the highest scoring category or 'general' if no clear match
    return max(scores, key=scores.get) if scores else 'general'

def get_context_instructions(prompt_type, tags):
    """Generate context-specific instructions based on prompt type"""
    instructions = {
        'writing': f"""Focus on content creation with these enhancements:
- Specify target audience, tone, and word count
- Include SEO keywords and content structure
- Add engagement strategies and call-to-action elements""",
        
        'creative': f"""Enhance creativity with these approaches:
- Add specific creative constraints and mediums
- Include inspiration sources and artistic techniques  
- Specify deliverables and success criteria""",
        
        'business': f"""Strengthen business focus with:
- Clear target market and competitive analysis
- Specific KPIs, budget considerations, and timelines
- Implementation steps and measurement methods""",
        
        'technical': f"""Add technical precision with:
- Specific technologies, frameworks, and requirements
- Performance criteria and scalability considerations
- Testing strategies and documentation needs""",
        
        'educational': f"""Improve educational value with:
- Learning objectives and prerequisite knowledge
- Step-by-step methodology and examples
- Assessment criteria and practice exercises""",
        
        'analysis': f"""Enhance analytical rigor with:
- Specific data sources and methodologies
- Comparison frameworks and evaluation criteria
- Actionable insights and recommendation formats""",
        
        'general': f"""Make it more specific with:
- Clear objectives and success criteria
- Specific context and constraints
- Actionable steps and measurable outcomes"""
    }
    
    base_instruction = instructions.get(prompt_type, instructions['general'])
    
    # Add tag-specific enhancements
    if tags:
        tag_enhancement = f"\nAdditional context from tags [{', '.join(tags)}]: Incorporate these themes naturally into each enhanced version."
        return base_instruction + tag_enhancement
    
    return base_instruction

def generate_intelligent_suggestions(prompt_text, tags):
    """Generate simple but helpful fallback suggestions when Gemini is unavailable"""
    
    # Simple fallback - just add helpful structure prompts
    suggestions = [
        f"Please provide a detailed response to: '{prompt_text}'. Include specific examples, step-by-step explanations, and practical tips that can be immediately applied.",
        
        f"Regarding '{prompt_text}': Explain this comprehensively with clear sections - start with an overview, then dive into key points with supporting details, and conclude with actionable takeaways or next steps.",
        
        f"Help me understand '{prompt_text}' by breaking it down into: 1) Core concepts explained simply, 2) Real-world examples or use cases, 3) Common mistakes to avoid, 4) Best practices or recommendations, and 5) Resources for learning more."
    ]
    
    return suggestions

# Route to suggest prompt improvements
@app.route("/suggest", methods=["POST", "OPTIONS"])
def suggest_prompt():
    # Handle preflight requests for CORS
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST")
        return response
        
    print(f"Request headers: {request.headers}")
    print(f"Request data: {request.get_data()}")
    data = request.json
    print(f"Parsed JSON data: {data}")
    
    prompt_text = data.get("promptText", "")
    tags = data.get("tags", [])
    
    print(f"Processing prompt: '{prompt_text}' with tags: {tags}")
    
    if not prompt_text:
        return jsonify({"error": "promptText is required"}), 400

    try:
        # Check rate limit
        ip_address = request.remote_addr
        if not check_rate_limit(ip_address):
            print(f"Rate limit exceeded for IP: {ip_address}")
            return jsonify({
                "error": "Rate limit exceeded. Please try again in a minute.",
                "suggestions": []
            }), 429
        
        # Check cache
        cache_key = get_cache_key(prompt_text, tags)
        if cache_key in prompt_cache:
            cached_entry = prompt_cache[cache_key]
            if datetime.now() - cached_entry['timestamp'] < timedelta(seconds=CACHE_TTL):
                print("✓ Returning cached suggestions")
                return jsonify(cached_entry['data'])
        
        suggestions = []
        
        # Try Gemini API first
        if USE_GEMINI:
            try:
                # Analyze the prompt type for context
                tag_context = f" (Tags: {', '.join(tags)})" if tags else ""
                
                gemini_prompt = f"""You are an expert prompt engineer. Your job is to take vague or incomplete prompts and transform them into clear, specific, actionable prompts that will get better AI responses.

ORIGINAL PROMPT: "{prompt_text}"{tag_context}

ANALYZE THE USER'S TRUE INTENT:
- What is the user actually trying to accomplish?
- What domain/context is this about? (travel, business, coding, writing, learning, etc.)
- What's missing that would help an AI give a better answer?

YOUR TASK: Create 3 improved versions of this prompt. Each should:

1. **Keep the original intent** - Don't change what the user wants to do
2. **Add specific details** that clarify the request:
   - Who is this for? (target audience, expertise level)
   - What format/structure do they want? (list, paragraph, step-by-step)
   - Any constraints? (budget, time, length, style)
   - What depth? (brief overview vs detailed analysis)
3. **Make it actionable** - Clear about what output they expect
4. **Each version explores a different angle** (different depth, format, or focus)

EXAMPLES:

Bad Original: "plan a trip to bangalore"
❌ Bad Improvement: "Create a strategic business plan for a trip to bangalore with market analysis" (Wrong - changed intent to business!)
✅ Good Improvement: "Plan a 2-day trip to Bangalore for 2-3 friends on a budget of ₹5000 per person, including: recommended bus services with booking links, day-by-day itinerary of 5-6 popular hangout spots (cafes, malls, Cubbon Park), estimated costs per activity, local food must-tries, and accommodation near MG Road or Indiranagar."

Bad Original: "write code for login"
❌ Bad Improvement: "Write detailed code for login system" (Too vague)
✅ Good Improvement: "Write a secure login system in Node.js + Express with: bcrypt password hashing, JWT token authentication, MongoDB user storage, input validation for email/password, error handling for wrong credentials, and basic rate limiting. Include both registration and login endpoints with example request/response."

Now improve this prompt. Return ONLY valid JSON (no markdown, no explanations):
["improved version 1", "improved version 2", "improved version 3"]"""

                print(f"🚀 Sending request to Gemini API ({MODEL_NAME})...")
                
                # Add retry logic for quota resets
                max_retries = 2
                for attempt in range(max_retries):
                    try:
                        response = model.generate_content(gemini_prompt)
                        response_text = response.text.strip()
                        break
                    except Exception as retry_error:
                        # Robustly check for HTTP 429 (quota exceeded)
                        status_code = getattr(retry_error, 'status_code', None)
                        if (status_code == 429 or "quota" in str(retry_error).lower() or "rate limit" in str(retry_error).lower()) and attempt < max_retries - 1:
                            print(f"⏳ Quota limit hit, waiting 2 seconds before retry...")
                            import time
                            time.sleep(2)
                        else:
                            raise retry_error
                
                print(f"📦 Gemini response received ({len(response_text)} chars)")
                
                # Extract JSON from markdown code blocks if present
                if "```json" in response_text:
                    response_text = response_text.split("```json")[1].split("```")[0].strip()
                elif "```" in response_text:
                    response_text = response_text.split("```")[1].split("```")[0].strip()
                
                # Parse JSON response
                parsed_suggestions = json.loads(response_text)
                
                suggestions = [str(s).strip() for s in parsed_suggestions if s and len(str(s).strip()) > MIN_SUGGESTION_LENGTH][:3]
                if isinstance(parsed_suggestions, list):
                    suggestions = [str(s).strip() for s in parsed_suggestions if s and len(str(s).strip()) > 50][:3]
                    if suggestions:
                        print(f"✅ Generated {len(suggestions)} high-quality suggestions via Gemini")
                        print(f"   Preview: {suggestions[0][:80]}...")
                        gemini_suggestions = suggestions.copy()
                    else:
                        print(f"✗ Gemini suggestions were too short, using fallback")
                else:
                    print(f"✗ Gemini returned non-list format")
                
            except json.JSONDecodeError as e:
                print(f"✗ Gemini JSON parse error: {str(e)}")
                print(f"   Response preview: {response_text[:200]}...")
                suggestions = []
            except Exception as e:
                error_msg = str(e)
                print(f"✗ Gemini API error: {error_msg[:150]}")
                if "429" in error_msg:
                    print(f"   ⚠️  Quota exceeded - falling back to smart engine")
                suggestions = []
        
        # Fallback to smart engine if Gemini fails or unavailable
        if len(suggestions) < 3:
            print(f"Using intelligent fallback engine")
            prompt_type = analyze_prompt_type(prompt_text, tags)
            fallback_suggestions = generate_intelligent_suggestions(prompt_text, tags)
            
            # Combine with any Gemini suggestions we got
            suggestions.extend(fallback_suggestions)
            suggestions = suggestions[:3]
            print(f"✓ Generated {len(suggestions)} suggestions via smart engine")
        
        # Cache the result
        result = {
            'suggestions': suggestions,
            'meta': {
                'gemini_used': bool(gemini_suggestions),
                'gemini_count': len(gemini_suggestions),
                'fallback_count': len(suggestions) - len(gemini_suggestions),
                'engine': (
                    'Gemini+Fallback' if gemini_suggestions and len(suggestions) > len(gemini_suggestions)
                    else ('Gemini' if gemini_suggestions else 'SmartEngine')
                )
            }
        }
        prompt_cache[cache_key] = {
            'data': result,
            'timestamp': datetime.now()
        }
        
        print(f"Final suggestions: {suggestions}")
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in suggest_prompt: {str(e)}")
        # Final fallback to smart engine for any error
        try:
            prompt_type = analyze_prompt_type(prompt_text, tags)
            suggestions = generate_intelligent_suggestions(prompt_text, tags)
            return jsonify({"suggestions": suggestions[:3]})
        except Exception as fallback_error:
            print(f"Smart engine also failed: {fallback_error}")
            return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint for deployment monitoring"""
    return jsonify({
        "status": "healthy",
        "service": "PromptPal Flask Backend",
        "gemini_configured": USE_GEMINI,
        "engine": "Gemini API + Smart Engine" if USE_GEMINI else "Smart Engine Only",
        "cors_origins": len(origins),
        "cache_size": len(prompt_cache)
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    try:
        # Use port from environment variable, default to 5001 if not set
        port = int(os.environ.get("FLASK_PORT", 5001))
        app.run(host="0.0.0.0", port=port, debug=True)
    except Exception as e:
        print("Flask failed to start:", e)
        sys.exit(1)
