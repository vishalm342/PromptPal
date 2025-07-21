from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import sys
from openai import OpenAI

load_dotenv()

app = Flask(__name__)
# Allow multiple origins for development flexibility
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",    
]

# Use the environment variable if set, otherwise use the origins list
cors_origin = os.getenv("CORS_ORIGIN")
if cors_origin:
    origins.append(cors_origin)

CORS(app, origins=origins, supports_credentials=True)

openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key:
    print(f"API Key being used: {openai_api_key[:5]}...{openai_api_key[-5:] if openai_api_key else 'None'}")

# Configuration for suggestion mode
# Set to False to use real OpenAI API, True to use enhanced mock suggestions
MOCK_MODE = os.getenv("MOCK_MODE", "True").lower() in ["true", "1", "yes"]
print(f"Mock mode is {'enabled' if MOCK_MODE else 'disabled'}")

if not MOCK_MODE:
    if not openai_api_key:
        print("WARNING: MOCK_MODE is disabled but no OpenAI API key is provided. Set OPENAI_API_KEY in .env file.")
        MOCK_MODE = True  # Fall back to mock mode if no API key
    else:
        client = OpenAI(api_key=openai_api_key)

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
        if MOCK_MODE:
            # Mock response to avoid OpenAI API quota issues
            print(f"Mock mode: Generating suggestions for prompt: {prompt_text}, tags: {tags}")
            tag_str = ", ".join(tags) if tags else "no specific tags"
            
            # Get topic from prompt text for more diverse suggestions
            topic = prompt_text.strip().lower()
            
            # More diverse and high-quality mock templates based on different types of content
            if "solve" in topic or "problem" in topic or "help" in topic:
                suggestions = [
                    f"Write a step-by-step guide to solve {topic} problems with clear examples and visual explanations that break down complex concepts into manageable parts",
                    f"Create a comprehensive tutorial on {topic} that includes common mistakes to avoid, practical exercises for reinforcement, and expert troubleshooting tips",
                    f"Design an interactive learning journey for {topic} using the Feynman technique, starting with fundamentals and building to advanced applications with regular knowledge checkpoints"
                ]
            elif "learn" in topic or "study" in topic or "understand" in topic:
                suggestions = [
                    f"Develop a structured 30-day learning roadmap for mastering {topic}, with daily goals, resources, practice exercises, and milestone assessments",
                    f"Create a comprehensive learning framework for {topic} that adapts to different learning styles (visual, auditory, kinesthetic) with tailored explanations and examples",
                    f"Design a project-based learning curriculum for {topic} with 5 progressive projects that build skills incrementally while creating portfolio-worthy outcomes"
                ]
            elif "create" in topic or "design" in topic or "develop" in topic:
                suggestions = [
                    f"Develop a detailed framework for {topic} with concrete examples, success metrics, implementation timeline, and risk mitigation strategies",
                    f"Create an innovative approach to {topic} that incorporates cutting-edge methodologies, addresses potential challenges, and includes A/B testing protocols",
                    f"Design a comprehensive blueprint for {topic} that balances theoretical foundations with practical real-world applications and includes stakeholder communication plans"
                ]
            elif "analyze" in topic or "research" in topic or "evaluate" in topic:
                suggestions = [
                    f"Conduct a thorough analysis of {topic} using multiple analytical frameworks (SWOT, PESTEL, Porter's Five Forces) and present findings with data visualizations and actionable insights",
                    f"Research {topic} from diverse perspectives, including historical context, current trends, future implications, and cross-cultural considerations with citations to authoritative sources",
                    f"Evaluate the effectiveness of different approaches to {topic} with specific criteria, case studies, comparative metrics, and recommendations for optimal implementation strategies"
                ]
            elif "explain" in topic or "describe" in topic or "define" in topic:
                suggestions = [
                    f"Explain {topic} using the pyramid principle - start with the main conclusion, support with key arguments, and substantiate with evidence and examples tailored to different expertise levels",
                    f"Create a multi-layered explanation of {topic} that progressively reveals complexity: ELI5 (explain like I'm 5), high school level, undergraduate level, and expert level perspectives",
                    f"Develop a comprehensive glossary and conceptual framework for {topic} with visual diagrams, real-world analogies, and interconnections between related concepts"
                ]
            elif "compare" in topic or "contrast" in topic or "versus" in topic or "vs" in topic:
                suggestions = [
                    f"Create a detailed comparison matrix for {topic} with feature-by-feature analysis, pros/cons, use cases, and definitive recommendations based on different user needs and contexts",
                    f"Develop a comprehensive comparison of {topic} with historical evolution, technical specifications, performance benchmarks, and future trajectory analysis",
                    f"Design an objective evaluation framework for {topic} with standardized assessment criteria, real-world performance data, user experience considerations, and cost-benefit analysis"
                ]
            elif "optimize" in topic or "improve" in topic or "enhance" in topic:
                suggestions = [
                    f"Develop a systematic optimization protocol for {topic} with baseline measurements, incremental improvement strategies, A/B testing methodology, and performance metrics tracking",
                    f"Create a comprehensive improvement roadmap for {topic} with quick wins, medium-term enhancements, and long-term strategic investments prioritized by impact and implementation effort",
                    f"Design an evidence-based enhancement framework for {topic} incorporating best practices, cutting-edge research, expert techniques, and continuous feedback mechanisms"
                ]
            else:
                # Default diverse templates for any other type of content
                suggestions = [
                    f"Create a comprehensive guide to {topic} that covers fundamental concepts, advanced techniques, practical applications, and emerging trends in {tag_str} with expert insights and resources",
                    f"Design an innovative framework for approaching {topic} that combines theoretical knowledge with hands-on examples, case studies, and implementation strategies tailored for {tag_str}",
                    f"Develop a structured learning path for mastering {topic} with progressive difficulty levels, milestone achievements, practical projects, and assessment tools focused on {tag_str}"
                ]
            
            return jsonify({"suggestions": suggestions})
        else:
            # Real OpenAI API call with enhanced system prompt for better quality and diversity
            tag_context = f" focused on {', '.join(tags)}" if tags else ""
            
            system_prompt = """You are an expert prompt engineer specializing in creating diverse, highly effective prompts. 
            When given a basic prompt idea, you provide 3 distinct, enhanced versions that:
            1. Are significantly more detailed and specific
            2. Have clear structure and outcomes 
            3. Include important constraints or parameters
            4. Use different approaches/methodologies
            5. Are formatted for direct use without numbering

            Your suggestions should be substantively different from each other, not just slight rewording."""
            
            user_prompt = f"Transform this basic prompt idea: '{prompt_text}'{tag_context} into 3 expert-level prompts."
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.8,  # Increase creativity
                max_tokens=300,   # Allow for more detailed responses
                presence_penalty=0.6,  # Encourage diversity between responses
                frequency_penalty=0.6  # Discourage repetition
            )

            # Process the response with better handling of different formats
            response_text = response.choices[0].message.content.strip()
            print(f"Raw API response: {response_text}")
            
            # Split by common delimiters and clean up
            import re
            
            # Try to split by numbered patterns like "1.", "1)", "Option 1:", etc.
            if re.search(r'^\d+[\.\):]', response_text, re.MULTILINE):
                suggestions = re.split(r'^\d+[\.\):]', response_text, flags=re.MULTILINE)
                suggestions = [s.strip() for s in suggestions if s.strip()]
            # Try splitting by newlines if we have at least 3 lines
            elif response_text.count('\n') >= 2:
                suggestions = [s.strip() for s in response_text.split('\n') if s.strip()]
            # Otherwise just use the whole text as one suggestion
            else:
                suggestions = [response_text]
            
            # Ensure we have exactly 3 suggestions
            while len(suggestions) < 3:
                if suggestions:
                    suggestions.append(f"Alternative approach to {prompt_text}")
                else:
                    suggestions = [
                        f"Create a detailed guide for {prompt_text}",
                        f"Develop a comprehensive framework for {prompt_text}",
                        f"Design an innovative approach to {prompt_text}"
                    ]
            
            # Trim to 3 suggestions if we have more
            suggestions = suggestions[:3]
            
            print(f"Processed suggestions: {suggestions}")
            return jsonify({"suggestions": suggestions})
    
    except Exception as e:
        print(f"Error in suggest_prompt: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    try:
        # Use port from environment variable, default to 10000 if not set
        port = int(os.environ.get("FLASK_PORT", 10000))
        app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG") == "True")
    except Exception as e:
        print("Flask failed to start:", e)
        sys.exit(1)
