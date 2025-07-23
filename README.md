# 🚀 PromptPal

PromptPal is a full-stack AI-powered web app to **save, organize, and share your favorite ChatGPT prompts** — with built-in **intelligent AI suggestions**.

---

## 🌟 Features

- Save and tag your prompts
- Mark prompts public or private
- Get **intelligent AI-powered prompt suggestions** (Ollama + Smart Engine)
- Explore community prompts
- Clean modern UI (Tailwind CSS)
- User authentication (JWT)
- **Local AI processing** with Ollama integration

---

## 🧠 Tech Stack

| Layer       | Tech                                 |
|-------------|--------------------------------------|
| Frontend    | React, Vite, Tailwind CSS, React Router |
| Backend     | Node.js, Express.js, MongoDB, Mongoose |
| AI Service  | Flask, Python, **Ollama + Smart Engine** |
| Auth        | JWT (Firebase Auth planned)           |
| Deployment  | Vercel, Render, MongoDB Atlas        |

---

## 🚀 Setup Instructions

**Each service runs in its own terminal window:**

### 1. Install Ollama (Optional - for local AI)
```bash
# Install Ollama on your system
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a lightweight model
ollama pull llama3.2:1b

# Start Ollama service
ollama serve
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
# OLLAMA_URL=http://localhost:11434  # Optional
# OLLAMA_MODEL=llama3.2:1b           # Optional

python app.py
```

---

## 🤖 AI Engine Features

PromptPal uses a **hybrid AI approach**:

### 🦙 **Ollama Integration** (Local AI)
- **Privacy-first**: All AI processing happens locally
- **No API costs**: Free unlimited usage
- **Fast responses**: Direct local model access
- **Works offline**: No internet required for suggestions

### 🧠 **Smart Suggestion Engine** (Built-in Fallback)
- **Context-aware**: Analyzes prompt type and tags
- **Intelligent enhancement**: Category-specific improvements
- **Always available**: Works even without Ollama
- **Production-ready**: Optimized for deployment

### 🔄 **Automatic Fallback**
```
User Request → Ollama (if available) → Smart Engine (fallback) → Enhanced Suggestions
```

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
- **Backend API**: Deployed on Render
- **AI Service**: Smart Engine (production) + Ollama (local development)

---

## 🔧 Environment Variables

### Flask Backend (.env)
```bash
FLASK_PORT=5001
CORS_ORIGIN=http://localhost:5173
OLLAMA_URL=http://localhost:11434  # Optional
OLLAMA_MODEL=llama3.2:1b           # Optional
```

### Node.js Backend (.env)
```bash
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## 🚀 Deployment

### Production Architecture
```
Vercel (Frontend) → Render (Flask AI) → Smart Engine
                 → Render (Node.js API) → MongoDB Atlas
```

**Note**: Ollama runs locally for development. Production uses the built-in Smart Suggestion Engine for reliable, fast AI suggestions.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Test locally with both Ollama and Smart Engine
4. Submit a pull request

---

## 📬 Contact

For questions or feedback, open an issue or reach out to vishalm8656@gmail.com.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
