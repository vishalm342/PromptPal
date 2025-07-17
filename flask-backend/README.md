# PromptPal Flask Backend

This is the Flask backend service for PromptPal, which provides AI-powered prompt suggestions using OpenAI's GPT-3.5-turbo model.

## Features

- RESTful API for generating prompt suggestions
- Integration with OpenAI's GPT-3.5-turbo
- Customizable through environment variables

## Prerequisites

- Python 3.8+
- OpenAI API Key

## Installation

1. Navigate to the flask-backend directory:

```bash
cd flask-backend
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file with the following contents:

```
OPENAI_API_KEY=your_openai_api_key_here
FLASK_PORT=5001
FLASK_DEBUG=True
CORS_ORIGIN=http://localhost:5173
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

## Usage

1. Start the Flask server:

```bash
python app.py
```

Or use the provided script:

```bash
./run.sh
```

2. The API will be available at `http://localhost:5001`

## API Endpoints

### POST /suggest

Generates 3 creative prompt suggestions based on input text and tags.

**Request Body:**

```json
{
  "promptText": "Create a story about a wizard",
  "tags": ["fantasy", "creative", "story"]
}
```

**Response:**

```json
{
  "suggestions": [
    "Create a compelling story about a novice wizard who discovers their powers came from an ancient curse that affects their family every third generation.",
    "Write a fantasy tale about a wizard who can only cast spells through musical instruments, and must assemble an orchestra to defeat an approaching army.",
    "Craft a story about a modern-day wizard hiding their abilities while working as a barista, until supernatural events force them to reveal their powers."
  ]
}
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `FLASK_PORT`: Port for the Flask server (default: 5001)
- `FLASK_DEBUG`: Enable debug mode (default: False)
- `CORS_ORIGIN`: Origin to allow for CORS (default: http://localhost:5173)

## Integration with Main Project

This Flask backend works alongside the Express backend and React frontend of PromptPal. It provides AI-powered prompt suggestions while the Express backend handles user authentication and prompt storage.
