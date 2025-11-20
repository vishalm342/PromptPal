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
    
    # Health & Fitness specific improvements
    if any(word in prompt_lower for word in ['weight', 'diet', 'fitness', 'workout', 'health', 'exercise']):
        suggestions = []
        gemini_suggestions = []  # Track high-quality suggestions returned directly by Gemini
        
        if 'weight' in prompt_lower and ('lose' in prompt_lower or 'cut' in prompt_lower or 'reduce' in prompt_lower):
            # Extract numbers if present
            import re
            numbers = re.findall(r'\d+', prompt_text)
            if len(numbers) >= 2:
                start_weight = numbers[0]
                target_weight = numbers[1]
                weight_loss = int(start_weight) - int(target_weight)
                
                suggestions = [
                    f"Create a comprehensive 6-month weight loss transformation plan to safely lose {weight_loss}kg (from {start_weight}kg to {target_weight}kg). Include: weekly calorie targets with macronutrient breakdown (protein/carbs/fats), meal timing strategy, specific food lists for each phase, sample meal plans, progressive workout schedule (cardio + resistance training), hydration goals, sleep recommendations, weekly check-in metrics, and contingency plans for plateaus.",
                    
                    f"Design a science-based nutrition and fitness roadmap for losing {weight_loss}kg in 6 months. Provide: Phase 1 (Months 1-2) diet plan with specific meals and calorie deficit, Phase 2 (Months 3-4) adjusted plan with new macros, Phase 3 (Months 5-6) maintenance transition. Include grocery shopping lists, meal prep guides, exercise routine (3 types: HIIT, strength training, cardio), supplement recommendations, progress tracking methods, and psychological strategies to maintain motivation.",
                    
                    f"Develop a personalized {start_weight}kg → {target_weight}kg transformation blueprint spanning 26 weeks. Detail: exact daily calorie intake for sustainable 0.5-0.8kg/week loss, high-protein food choices to preserve muscle, carb cycling strategy, intermittent fasting protocols, 5-day workout split with specific exercises, cardio optimization, cheat meal guidelines, body recomposition techniques, how to handle social eating situations, and monthly milestone celebrations to stay on track."
                ]
            else:
                suggestions = [
                    f"Create a structured weight loss plan that includes: specific calorie targets based on your BMR and activity level, macronutrient ratios optimized for fat loss, weekly meal plans with exact portions, grocery lists organized by food category, a progressive 12-week workout program combining strength and cardio, hydration protocols, sleep hygiene tips, and tracking methods to measure progress beyond the scale.",
                    
                    f"Design a holistic fat loss strategy addressing: nutrition (meal timing, food quality, portion control), training (resistance 3x/week, cardio 2x/week with specific intensities), recovery (sleep targets, stress management), accountability systems, how to navigate dining out, supplement stack for enhanced results, and metabolic adaptation strategies to prevent plateaus.",
                    
                    f"Develop a sustainable lifestyle transformation plan covering: evidence-based nutrition principles, specific food swaps to reduce calories without hunger, meal prep workflow for busy schedules, bodyweight and gym-based exercise routines, habit stacking techniques, psychological tools to overcome emotional eating, progress photos and measurement protocols, and a maintenance phase to keep weight off long-term."
                ]
        
        elif 'muscle' in prompt_lower or 'gain' in prompt_lower or 'bulk' in prompt_lower:
            suggestions = [
                f"Build a muscle-building program with: progressive overload training split (push/pull/legs), specific rep ranges and rest times, calorie surplus calculations, high-protein meal plans (1.6-2.2g per kg bodyweight), pre/post-workout nutrition timing, supplement stack (creatine, protein, etc.), recovery protocols, and 12-week progression markers.",
                
                f"Design a lean bulking strategy that includes: clean surplus calorie targets, macro-optimized meal plans emphasizing whole foods, compound lift progression (bench, squat, deadlift, OHP), accessory exercise selection, training volume periodization, deload weeks, body composition tracking, and strategies to minimize fat gain while maximizing muscle growth.",
                
                f"Create a hypertrophy-focused transformation plan: calculate your TDEE + 300-500 calorie surplus, structure 4-5 day training split with progressive overload, detailed exercise form cues, meal timing for anabolism, sleep optimization for recovery and growth hormone, supplementation for muscle protein synthesis, and monthly reassessment protocols."
            ]
        
        else:
            # General health/fitness
            suggestions = [
                f"Develop a holistic health improvement plan addressing: balanced nutrition with portion guidelines, weekly exercise routine (cardio + strength), sleep hygiene practices, stress reduction techniques, hydration targets, and measurable health markers to track progress (energy levels, body composition, performance metrics).",
                
                f"Create a sustainable fitness lifestyle blueprint: daily habits that compound over time, nutrition framework focusing on whole foods and consistency, beginner-friendly workout program that progresses in intensity, recovery and mobility work, accountability systems, and long-term behavior change strategies.",
                
                f"Design a comprehensive wellness program covering: evidence-based nutrition principles, structured training schedule with specific exercises and progressions, meal prep strategies, healthy habit tracking, mental health practices, social support systems, and quarterly goal reviews to ensure continuous improvement."
            ]
        
        return suggestions
    
    # Business & Marketing
    elif any(word in prompt_lower for word in ['marketing', 'business', 'campaign', 'strategy', 'sales']):
        suggestions = [
            f"Develop a comprehensive {prompt_type} strategy that includes: target audience analysis with specific demographics and psychographics, competitive landscape assessment, unique value proposition definition, multi-channel marketing mix, content calendar for 90 days, budget allocation across channels, KPIs and success metrics, and A/B testing framework.",
            
            f"Create an actionable {action_verb} plan for {core_subject} featuring: customer journey mapping, conversion funnel optimization, specific tactics for each awareness stage, email automation sequences, social media content strategy with posting schedules, paid advertising recommendations with targeting parameters, and monthly performance review checkpoints.",
            
            f"Design a results-driven approach to {core_subject} covering: market research findings, positioning strategy, brand messaging guidelines, growth hacking tactics, sales enablement materials, partnership opportunities, crisis communication protocols, and quarterly OKRs with measurable outcomes."
        ]
        return suggestions
    
    # Technical & Development
    elif any(word in prompt_lower for word in ['code', 'develop', 'build', 'app', 'software', 'programming', 'system']):
        suggestions = [
            f"Architect a robust technical solution for {core_subject} that includes: system design diagram, technology stack selection with justification, database schema design, API endpoint specifications, authentication and authorization flow, error handling strategies, testing plan (unit/integration/e2e), deployment pipeline, monitoring and logging setup, and scalability considerations.",
            
            f"Develop a production-ready implementation plan for {core_subject} covering: project structure and file organization, core features broken into user stories, technical dependencies and third-party integrations, security best practices, performance optimization techniques, CI/CD configuration, documentation standards, code review checklist, and maintenance protocols.",
            
            f"Create a comprehensive development roadmap for {core_subject} featuring: MVP feature set definition, sprint planning (2-week cycles), technical architecture decisions, infrastructure requirements, DevOps workflow, quality assurance procedures, beta testing strategy, launch checklist, and post-launch monitoring plan."
        ]
        return suggestions
    
    # Creative & Design
    elif any(word in prompt_lower for word in ['design', 'creative', 'art', 'visual', 'brand', 'logo', 'graphic']):
        suggestions = [
            f"Create a compelling creative concept for {core_subject} including: mood board with visual inspiration, color palette with psychological reasoning, typography system (primary/secondary fonts), visual hierarchy principles, design system components, responsive breakpoints, accessibility guidelines, and brand application examples across different media.",
            
            f"Develop a comprehensive design strategy for {core_subject} covering: user research insights, competitive design analysis, wireframes and prototypes, interaction design patterns, motion design principles, design tokens and variables, asset organization system, stakeholder presentation deck, and implementation guidelines for developers.",
            
            f"Design an innovative approach to {core_subject} featuring: conceptual exploration through sketches, iterative refinement process, style guide documentation, iconography and illustration style, grid system and spacing rules, micro-interactions, design QA checklist, and versioning strategy for design files."
        ]
        return suggestions
    
    # Writing & Content
    elif any(word in prompt_lower for word in ['write', 'content', 'blog', 'article', 'story', 'copy']):
        suggestions = [
            f"Write {core_subject} with a clear structure: attention-grabbing headline using power words, compelling introduction with a hook, body organized into 5-7 scannable sections with subheadings, actionable takeaways in each section, relevant examples or case studies, data/statistics to support claims, smooth transitions between ideas, and a strong conclusion with clear call-to-action.",
            
            f"Create engaging content about {core_subject} that includes: target audience pain points addressed upfront, storytelling elements to maintain interest, expert quotes or interviews for credibility, visual content suggestions (infographics, charts, images), SEO optimization with primary and secondary keywords, internal/external linking strategy, social media snippet variations, and email teaser copy.",
            
            f"Develop comprehensive written piece on {core_subject} featuring: thorough research from 5+ authoritative sources, original insights or unique angle, practical tips readers can implement immediately, relevant FAQs section, table of contents for long-form content, pull quotes for emphasis, suggested multimedia enhancements, and content upgrade offer (downloadable checklist/template)."
        ]
        return suggestions
    
    # Learning & Education
    elif any(word in prompt_lower for word in ['learn', 'teach', 'explain', 'tutorial', 'guide', 'course', 'education']):
        suggestions = [
            f"Create a structured learning path for {core_subject} that includes: prerequisite knowledge assessment, clear learning objectives with measurable outcomes, module breakdown from beginner to advanced, hands-on exercises after each concept, real-world project to apply skills, knowledge checks and quizzes, common pitfalls and troubleshooting guide, additional resources for deep dives, and completion certificate criteria.",
            
            f"Develop an engaging educational experience for {core_subject} featuring: video lesson outlines with timestamps, interactive demonstrations, practice problems with detailed solutions, downloadable worksheets and templates, community forum for peer learning, instructor Q&A sessions, progress tracking dashboard, skill assessments, and next steps for continued learning.",
            
            f"Design a comprehensive tutorial for {core_subject} covering: step-by-step instructions with screenshots/diagrams, explanation of underlying concepts, best practices and pro tips, alternative approaches and when to use them, troubleshooting common errors, code snippets or templates to reference, recap of key takeaways, and suggested exercises to reinforce learning."
        ]
        return suggestions
    
    # Default: Generic but quality improvements
    else:
        suggestions = [
            f"Create a detailed and actionable plan for '{prompt_text}' that includes: specific objectives with measurable outcomes, step-by-step methodology, required resources and tools, timeline with milestones, potential challenges and mitigation strategies, success criteria, and next action steps to begin implementation.",
            
            f"Develop a comprehensive approach to '{prompt_text}' covering: background research and context, best practices from industry leaders, multiple strategic options with pros/cons, recommended path forward with clear rationale, implementation checklist, key stakeholders to involve, and progress monitoring framework.",
            
            f"Design a structured framework for '{prompt_text}' featuring: clear problem definition, root cause analysis, creative solution ideation, evaluation criteria for comparing options, detailed action plan with responsibilities, resource requirements, risk assessment, and feedback loops for continuous improvement."
        ]
        return suggestions

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
            fallback_suggestions = generate_intelligent_suggestions(prompt_text, tags, prompt_type)
            
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
            suggestions = generate_intelligent_suggestions(prompt_text, tags, prompt_type)
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
