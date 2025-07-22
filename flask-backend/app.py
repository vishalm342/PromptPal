from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import sys
import requests
import json
import re

load_dotenv()

app = Flask(__name__)
# Allow multiple origins for development flexibility and production
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
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

# Configuration for Ollama
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:1b")
print(f"Ollama URL: {OLLAMA_URL}")
print(f"Ollama Model: {OLLAMA_MODEL}")

def test_ollama_connection():
    """Test if Ollama is running and the model is available"""
    try:
        response = requests.get(f"{OLLAMA_URL}/api/tags")
        if response.status_code == 200:
            models = response.json().get("models", [])
            model_names = [model["name"] for model in models]
            if OLLAMA_MODEL in model_names:
                print(f"✓ Ollama is running and model '{OLLAMA_MODEL}' is available")
                return True
            else:
                print(f"✗ Model '{OLLAMA_MODEL}' not found. Available models: {model_names}")
                return False
        else:
            print(f"✗ Failed to connect to Ollama at {OLLAMA_URL}")
            return False
    except Exception as e:
        print(f"✗ Error connecting to Ollama: {str(e)}")
        return False

# Test Ollama connection on startup
ollama_available = test_ollama_connection()

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

def generate_intelligent_suggestions(prompt_text, tags, prompt_type):
    """Generate highly intelligent, context-aware suggestions based on prompt analysis"""
    
    # Extract key components from the prompt
    prompt_lower = prompt_text.lower()
    tag_context = ', '.join(tags) if tags else ""
    
    # Get the main subject from the prompt - extract the core topic
    words = prompt_text.split()
    if len(words) <= 3:
        subject = prompt_text
    elif 'create' in prompt_lower or 'write' in prompt_lower or 'develop' in prompt_lower:
        # Extract what comes after action words
        action_words = ['create', 'write', 'develop', 'design', 'build', 'make']
        for action in action_words:
            if action in prompt_lower:
                idx = prompt_lower.split().index(action)
                if idx + 1 < len(words):
                    subject = ' '.join(words[idx + 1:])
                    break
        else:
            subject = ' '.join(words[-2:])
    else:
        subject = prompt_text
    
    # Define ultra-smart suggestion templates based on prompt type
    if prompt_type == 'writing':
        if 'blog' in prompt_lower:
            return [
                f"Write a comprehensive 1500-word blog post about {subject} targeting tech professionals, including an engaging hook, 5 actionable insights with real-world examples, data-driven statistics, expert quotes, and a compelling CTA",
                f"Create a beginner-friendly guide to {subject} with step-by-step instructions, common pitfalls to avoid, recommended tools/resources, practical exercises, and a downloadable checklist",
                f"Develop a thought-leadership piece on {subject} featuring industry trends, future predictions, controversial opinions, case studies from 3 major companies, and actionable takeaways for executives"
            ]
        elif 'story' in prompt_lower:
            return [
                f"Craft a compelling narrative about {subject} with a relatable protagonist, clear conflict and resolution, emotional depth, dialogue that drives the plot, and a memorable ending that ties to the central theme",
                f"Write an engaging short story featuring {subject} with vivid sensory descriptions, character development through actions rather than exposition, unexpected plot twists, and symbolism that enhances the deeper meaning",
                f"Create a multi-perspective story about {subject} told from 3 different viewpoints, showing how the same events impact various characters, with interconnected storylines and a satisfying convergence"
            ]
        else:
            return [
                f"Write a well-researched article about {subject} with expert interviews, statistical analysis, multiple perspectives, actionable recommendations, and proper citations from authoritative sources",
                f"Create an engaging piece on {subject} using storytelling techniques, personal anecdotes, clear structure with subheadings, compelling visuals suggestions, and social media optimization",
                f"Develop an authoritative content piece about {subject} featuring original research, industry insights, practical frameworks, implementation guides, and measurable outcomes"
            ]
    
    elif prompt_type == 'business':
        if 'marketing' in prompt_lower or 'campaign' in prompt_lower:
            return [
                f"Design a comprehensive marketing campaign for {subject} targeting millennials and Gen Z, including social media strategy across 4 platforms, influencer partnerships, user-generated content initiatives, budget allocation ($50K), timeline (6 months), and KPIs (reach, engagement, conversions)",
                f"Create a data-driven marketing strategy for {subject} with customer persona research, competitive analysis, multi-channel approach (digital + traditional), A/B testing framework, attribution modeling, and ROI measurement dashboard",
                f"Develop an innovative campaign for {subject} using experiential marketing, gamification elements, AR/VR integration, community building tactics, brand partnerships, crisis management plan, and viral potential optimization"
            ]
        else:
            return [
                f"Create a strategic business plan for {subject} including market analysis, competitive positioning, revenue model, go-to-market strategy, funding requirements, team structure, and 3-year growth projections",
                f"Develop a comprehensive strategy for {subject} with SWOT analysis, risk assessment, implementation roadmap, resource allocation, success metrics, stakeholder management, and contingency planning",
                f"Design a scalable business framework for {subject} featuring operational processes, technology stack, team roles, performance indicators, customer acquisition strategy, and expansion planning"
            ]
    
    elif prompt_type == 'technical':
        return [
            f"Develop a robust technical solution for {subject} using microservices architecture, Docker containerization, CI/CD pipeline, automated testing, monitoring with Prometheus, database optimization, security best practices, and scalability planning",
            f"Create a comprehensive system for {subject} with clean code architecture, API design, database schema, caching strategy, error handling, logging, documentation, performance benchmarks, and deployment procedures",
            f"Build an enterprise-grade implementation of {subject} featuring modular design, cloud-native deployment, security compliance, disaster recovery, load balancing, API rate limiting, and real-time monitoring"
        ]
    
    elif prompt_type == 'creative':
        return [
            f"Design an innovative creative concept for {subject} with mood board development, color psychology application, typography hierarchy, visual storytelling elements, user experience flow, interactive components, and brand consistency guidelines",
            f"Create a compelling creative project for {subject} featuring original artwork, multimedia integration, narrative structure, audience engagement strategies, iterative design process, feedback incorporation, and final presentation format",
            f"Develop a unique creative approach to {subject} using experimental techniques, cross-media integration, collaborative elements, sustainability considerations, cultural sensitivity, and measurable impact assessment"
        ]
    
    elif prompt_type == 'educational':
        return [
            f"Create a comprehensive learning program for {subject} with clear learning objectives, progressive skill building, hands-on exercises, assessment methods, multimedia resources, peer collaboration, and certification pathway",
            f"Develop an engaging educational experience about {subject} featuring interactive lessons, real-world applications, case studies, expert guest speakers, practical assignments, and progress tracking",
            f"Design a complete curriculum for {subject} including prerequisite knowledge, module breakdown, learning outcomes, teaching methodologies, resource library, and student evaluation criteria"
        ]
    
    else:  # general or analysis
        return [
            f"Conduct a thorough analysis of {subject} with data collection methodology, statistical analysis, trend identification, comparative research, expert insights, actionable recommendations, and implementation timeline",
            f"Create a comprehensive research project on {subject} featuring literature review, primary data collection, quantitative and qualitative analysis, visual data representation, key findings, and strategic implications",
            f"Develop an in-depth evaluation of {subject} using multiple analytical frameworks, stakeholder perspectives, risk assessment, cost-benefit analysis, and evidence-based conclusions with implementation roadmap"
        ]

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
        # Analyze the prompt type and create context-aware instructions
        prompt_type = analyze_prompt_type(prompt_text, tags)
        
        # Try Ollama first with very fast settings, fallback to smart engine if it fails
        suggestions = []
        
        if ollama_available:
            try:
                # Ultra-fast Ollama request
                smart_prompt = f"Improve this prompt: '{prompt_text}'. Give 3 specific versions:\n1.\n2.\n3."
                
                ollama_payload = {
                    "model": OLLAMA_MODEL,
                    "prompt": smart_prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "num_predict": 100,  # Very short responses
                        "num_ctx": 256,      # Minimal context
                        "stop": ["4.", "\n\n"]
                    }
                }
                
                print(f"Trying fast Ollama request...")
                response = requests.post(
                    f"{OLLAMA_URL}/api/generate",
                    headers={"Content-Type": "application/json"},
                    json=ollama_payload,
                    timeout=5  # Very short timeout
                )
                
                if response.status_code == 200:
                    response_text = response.json().get("response", "").strip()
                    
                    # Quick parse for numbered items
                    lines = response_text.split('\n')
                    for line in lines:
                        if re.match(r'^\s*[123]\.\s*(.+)', line):
                            suggestion = re.match(r'^\s*[123]\.\s*(.+)', line).group(1).strip()
                            if len(suggestion) > 15:
                                suggestions.append(suggestion)
                
                print(f"Ollama suggestions: {len(suggestions)} found")
                
            except Exception as e:
                print(f"Ollama failed quickly: {e}")
        
        # If Ollama didn't give us 3 good suggestions, use smart engine
        if len(suggestions) < 3:
            print(f"Using intelligent suggestion engine for {prompt_type}")
            suggestions = generate_intelligent_suggestions(prompt_text, tags, prompt_type)
        # If Ollama didn't give us 3 good suggestions, use smart engine
        if len(suggestions) < 3:
            print(f"Using intelligent suggestion engine for {prompt_type}")
            suggestions = generate_intelligent_suggestions(prompt_text, tags, prompt_type)
        
        # Ensure exactly 3 suggestions
        suggestions = suggestions[:3]
        
        print(f"Final suggestions: {suggestions}")
        return jsonify({"suggestions": suggestions})
    
    except requests.exceptions.Timeout:
        print("Ollama request timed out")
        return jsonify({"error": "Request timed out. The AI model is taking too long to respond."}), 504
    except requests.exceptions.ConnectionError:
        print("Failed to connect to Ollama")
        return jsonify({"error": "Cannot connect to Ollama service. Please ensure Ollama is running."}), 503
    except Exception as e:
        print(f"Error in suggest_prompt: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == "__main__":
    try:
        # Use port from environment variable, default to 5001 if not set
        port = int(os.environ.get("FLASK_PORT", 5001))
        app.run(host="0.0.0.0", port=port, debug=True)
    except Exception as e:
        print("Flask failed to start:", e)
        sys.exit(1)
