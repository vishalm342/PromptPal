# 🚀 PromptPal

PromptPal is a full-stack AI-powered web app to **save, organize, and share your favorite ChatGPT prompts** — with built-in **intelligent AI suggestions powered by Google Gemini**.

---

## 🌟 Features

- 💾 Save and tag your prompts
- 🔒 Mark prompts public or private
- 🤖 Get **intelligent AI-powered prompt suggestions** (Google Gemini API + Smart Engine)
- 🌍 Explore community prompts
- 🎨 Clean modern UI (Tailwind CSS)
- 🔐 User authentication (JWT)
- ⚡ Fast, context-aware suggestions with **gemini-2.5-flash-lite**

---

## 🧠 Tech Stack

| Layer       | Tech                                 |
|-------------|--------------------------------------|
| Frontend    | React, Vite, Tailwind CSS, React Router |
| Backend     | Node.js, Express.js, MongoDB, Mongoose |
| AI Service  | Flask, Python, **Google Gemini API + Smart Engine** |
| Auth        | JWT (Firebase Auth planned)           |
| Deployment  | Vercel, Render, MongoDB Atlas        |

---

## 🚀 Setup Instructions

### 🐳 Docker Setup (Recommended - Easy!)

**One-command deployment with Docker:**

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env and add your API keys
nano .env

# 3. Start everything with Docker
./docker-start.sh
# OR manually: docker-compose up -d
```

**That's it!** Access at http://localhost:3000

📖 **[Read the complete Docker guide](DOCKER_SETUP.md)** for troubleshooting and advanced usage.

---

### 📦 Manual Setup (Alternative)

**Each service runs in its own terminal window:**

### 1. Get Google Gemini API Key
```bash
# Visit Google AI Studio and create a free API key
# https://aistudio.google.com/app/apikey

# Copy your API key for the next step
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 3. Backend (API server) Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

npm start
```

### 4. Flask AI Service Setup
```bash
cd flask-backend
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Edit .env with your settings:
# FLASK_PORT=5001
# CORS_ORIGIN=http://localhost:5173
# GEMINI_API_KEY=your_gemini_api_key_here

python app.py
```

---

## 🤖 AI Engine Features

PromptPal uses a **hybrid AI approach** with Google Gemini:

### 🌟 **Google Gemini API** (Primary AI Engine)
- **Powered by gemini-2.5-flash-lite**: Fast, efficient, and cost-effective
- **High-quality suggestions**: Advanced language understanding
- **Context-aware**: Analyzes your prompt and tags intelligently
- **Rate limiting**: Smart caching and quota management
- **Reliable**: Production-ready with automatic retry logic

### 🧠 **Smart Suggestion Engine** (Built-in Fallback)
- **Context-aware**: Analyzes prompt type and tags
- **Intelligent enhancement**: Category-specific improvements for:
  - ✍️ Writing & Content
  - 💼 Business & Marketing  
  - 💻 Technical & Development
  - 🎨 Creative & Design
  - 📚 Educational & Learning
  - 📊 Analysis & Research
  - 💪 Health & Fitness
- **Always available**: Works even without API key
- **Zero-cost**: No API charges for fallback mode

### 🔄 **Automatic Fallback System**
```
User Request → Gemini API (if quota available) → Smart Engine (if needed) → Enhanced Suggestions
```

**Benefits:**
- ✅ Never fails to provide suggestions
- ✅ Optimized for quota efficiency  
- ✅ 1-hour caching reduces duplicate requests
- ✅ 15 requests/minute rate limiting
- ✅ Graceful degradation on quota limits

---

## 📁 Project Structure

```
PromptPal/
├── client/          # React frontend
├── server/          # Node.js API backend
├── flask-backend/   # Python AI service
└── README.md
```

---

## 🌐 Live Demo

- **Frontend**: [https://prompt-pal-murex.vercel.app](https://prompt-pal-murex.vercel.app)
- **Backend API**: [https://promptpal-umwk.onrender.com/](https://promptpal-umwk.onrender.com/)
- **AI Service**: Google Gemini API (production) + Smart Engine (fallback)

---

## 🔧 Environment Variables

### Flask Backend (.env)
```bash
FLASK_PORT=5001
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your Gemini API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy and paste into your `.env` file

### Node.js Backend (.env)
```bash
PORT=3001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Deployment

### Production Architecture
```
Vercel (Frontend) → Render (Flask AI + Gemini API) → Smart Engine Fallback
                 → Render (Node.js API) → MongoDB Atlas
```

**Deployment Steps:**

1. **Frontend (Vercel)**
   - Connect your GitHub repository
   - Deploy from `client/` directory
   - Set build command: `npm run build`
   - Set output directory: `dist`

2. **Flask AI Service (Render)**
   - Deploy from `flask-backend/` directory
   - Add environment variable: `GEMINI_API_KEY`
   - Start command: `python app.py`

3. **Node.js Backend (Render)**
   - Deploy from `server/` directory
   - Add environment variables: `MONGODB_URI`, `JWT_SECRET`
   - Start command: `npm start`

**Note**: Gemini API provides free tier with generous quotas. Smart Engine automatically activates if quota is exceeded.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Test locally with Gemini API and Smart Engine fallback
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### Testing AI Suggestions
```bash
# Test Gemini API directly
cd flask-backend
python test_model_switch.py

# Test full suggestion endpoint
curl -X POST http://localhost:5001/suggest \
  -H "Content-Type: application/json" \
  -d '{"promptText":"Write a blog post","tags":["writing"]}'
```

---

## 📊 API Quotas & Limits

**Google Gemini API Free Tier:**
- Generous monthly quota
- 15 requests per minute (enforced by Flask backend)
- Smart caching reduces duplicate requests
- Automatic fallback to Smart Engine on quota limits

**Monitor your usage:**
- [Google AI Studio Usage Dashboard](https://ai.dev/usage?tab=rate-limit)

---

## 🔒 Security Notes

- **Never commit .env files** to version control
- API keys are sensitive - store them securely
- Use environment variables for all secrets
- The `.gitignore` is configured to exclude `.env` files
- For production, use platform-specific secret management

---

## 📬 Contact

For questions or feedback, open an issue or reach out to vishalm8656@gmail.com.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
