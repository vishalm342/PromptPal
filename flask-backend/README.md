# PromptPal Flask Backend

This is the Flask backend service for PromptPal, which provides AI-powered prompt suggestions using **Google Gemini API (gemini-2.5-flash-lite)** with an intelligent fallback system.

## Features

- 🤖 RESTful API for generating prompt suggestions
- 🌟 Integration with Google Gemini API (gemini-2.5-flash-lite)
- 🧠 Smart Suggestion Engine as fallback
- ⚡ Rate limiting and caching for efficiency
- 🔄 Automatic retry logic for quota management
- 🎯 Context-aware suggestions based on prompt type
- 🔒 CORS configuration for secure frontend integration

## Prerequisites

- Python 3.8+
- Google Gemini API Key (free tier available)

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

```bash
GEMINI_API_KEY=your_gemini_api_key_here
FLASK_PORT=5001
CORS_ORIGIN=http://localhost:5173
```

**Get your Gemini API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your key and paste it into the `.env` file

## Usage

1. Start the Flask server:

```bash
python app.py
```

You should see:
```
✓ Gemini API configured successfully (using gemini-2.5-flash-lite)
 * Running on http://127.0.0.1:5001
```

2. The API will be available at `http://localhost:5001`

## API Endpoints

### POST /suggest

Generates 3 creative prompt suggestions based on input text and tags.

**Request Body:**

```json
{
  "promptText": "Write a blog post about AI",
  "tags": ["writing", "AI", "technology"]
}
```

**Response (with Gemini API):**

```json
{
  "suggestions": [
    "Write a comprehensive 2000-word blog post exploring how AI is transforming content creation in 2025. Include: current AI writing tools comparison, ethical considerations, 5 real-world case studies, expert predictions for the next 3 years, and actionable tips for writers to stay relevant in an AI-augmented world.",
    "Create an engaging blog post about AI that breaks down complex concepts for beginners. Structure it with: an attention-grabbing headline, relatable analogies, visual content suggestions, common misconceptions debunked, and a 'try it yourself' section with 3 beginner-friendly AI tools.",
    "Develop a thought-provoking opinion piece on AI's impact on creative writing. Address: the creativity vs automation debate, interviews with 2-3 authors using AI, analysis of AI-generated vs human content, future implications for the publishing industry, and your personal stance with supporting evidence."
  ],
  "meta": {
    "gemini_used": true,
    "gemini_count": 3,
    "fallback_count": 0,
    "engine": "Gemini"
  }
}
```

**Response (Smart Engine Fallback):**

```json
{
  "suggestions": [
    "Write a blog post about AI with a clear structure: attention-grabbing headline using power words, compelling introduction with a hook...",
    "Create engaging content about AI that includes: target audience pain points addressed upfront...",
    "Develop comprehensive written piece on AI featuring: thorough research from 5+ authoritative sources..."
  ],
  "meta": {
    "gemini_used": false,
    "gemini_count": 0,
    "fallback_count": 3,
    "engine": "SmartEngine"
  }
}
```

### GET /health

Health check endpoint to verify service status.

**Response:**

```json
{
  "status": "healthy",
  "service": "PromptPal Flask Backend",
  "gemini_configured": true,
  "engine": "Gemini API + Smart Engine",
  "cors_origins": 8,
  "cache_size": 0
}
```

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required for AI suggestions)
- `FLASK_PORT`: Port for the Flask server (default: 5001)
- `CORS_ORIGIN`: Origin to allow for CORS (default: http://localhost:5173)

## AI Engine Architecture

### Gemini API (Primary)
- **Model**: gemini-2.5-flash-lite
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 1024 (efficient responses)
- **Top P**: 0.9
- **Top K**: 40

### Smart Engine (Fallback)
Automatically activates when:
- Gemini API key is not provided
- API quota is exceeded (429 error)
- API request fails
- Network issues occur

### Features:
- ✅ Rate limiting (15 requests/minute)
- ✅ Response caching (1 hour TTL)
- ✅ Automatic retry on quota reset
- ✅ Context-aware suggestions by category
- ✅ Graceful degradation

## Testing

### Test Gemini Configuration
```bash
python test_gemini.py
```

### Test Model Switch
```bash
python test_model_switch.py
```

### Test API Endpoint
```bash
curl -X POST http://localhost:5001/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "promptText": "Create a marketing campaign",
    "tags": ["marketing", "business"]
  }'
```

## Rate Limits & Quotas

**Flask Backend Limits:**
- 15 requests per minute per IP address
- 1-hour cache for identical requests
- Automatic rate limit headers in responses

**Google Gemini Free Tier:**
- Generous monthly quota
- Monitor usage at: https://ai.dev/usage?tab=rate-limit
- Automatic fallback on quota exceeded

## Integration with Main Project

This Flask backend works alongside the Express backend and React frontend of PromptPal:

```
React Frontend (Vite)
       ↓
Express Backend (Node.js) ← User Auth, Prompt Storage
       ↓
Flask AI Service (Python) ← AI Suggestions
       ↓
Google Gemini API / Smart Engine
```

## Troubleshooting

### Issue: "429 Quota exceeded"
**Solution**: 
- Check your quota at https://ai.dev/usage
- Enable billing for higher limits
- Smart Engine automatically activates as fallback

### Issue: "No Gemini API key found"
**Solution**:
- Verify `.env` file exists in flask-backend/
- Check `GEMINI_API_KEY` is set correctly
- Restart Flask server after adding key

### Issue: "CORS errors"
**Solution**:
- Verify `CORS_ORIGIN` matches your frontend URL
- Check frontend is running on expected port
- Add additional origins to the `origins` list in app.py

## Production Deployment

### Recommended: Render.com

1. Create new Web Service
2. Connect your repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python app.py`
5. Add environment variable: `GEMINI_API_KEY`
6. Deploy!

### Environment Variables for Production:
```bash
GEMINI_API_KEY=your_production_api_key
FLASK_PORT=5001
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## Contributing

See main project README for contribution guidelines.

## License

This project is part of PromptPal and follows the same MIT License.
