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
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
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
                    f"Write a step-by-step guide to solve {topic} problems with clear examples and visual explanations that break down complex concepts",
                    f"Create a comprehensive tutorial on {topic} that includes common mistakes to avoid and practical exercises for reinforcement",
                    f"Design an interactive learning journey for {topic} using the Feynman technique, starting with fundamentals and building to advanced applications"
                ]
            elif "create" in topic or "design" in topic or "develop" in topic:
                suggestions = [
                    f"Develop a detailed framework for {topic} with concrete examples, success metrics, and implementation timeline",
                    f"Create an innovative approach to {topic} that incorporates cutting-edge methodologies and addresses potential challenges",
                    f"Design a comprehensive blueprint for {topic} that balances theoretical foundations with practical real-world applications"
                ]
            elif "analyze" in topic or "research" in topic or "evaluate" in topic:
                suggestions = [
                    f"Conduct a thorough analysis of {topic} using multiple analytical frameworks and present findings with visualizations",
                    f"Research {topic} from diverse perspectives, including historical context, current trends, and future implications",
                    f"Evaluate the effectiveness of different approaches to {topic} with specific criteria, case studies, and comparative metrics"
                ]
            else:
                # Default diverse templates for any other type of content
                suggestions = [
                    f"Create a comprehensive guide to {topic} that covers fundamental concepts, advanced techniques, and practical applications in {tag_str}",
                    f"Design an innovative framework for approaching {topic} that combines theoretical knowledge with hands-on examples tailored for {tag_str}",
                    f"Develop a structured learning path for mastering {topic} with progressive difficulty levels and milestone achievements focused on {tag_str}"
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
        port = int(os.getenv("FLASK_PORT", 5001))
        app.run(debug=os.getenv("FLASK_DEBUG") == "True", port=port)
    except Exception as e:
        print("Flask failed to start:", e)
        sys.exit(1)
