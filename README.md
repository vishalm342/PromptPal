# 🚀 PromptPal

PromptPal is a full-stack AI-powered web app to **save, organize, and share your favorite ChatGPT prompts** — with built-in GPT-powered suggestions.

---

## 🌟 Features

- Save and tag your prompts
- Mark prompts public or private
- Get AI-generated prompt suggestions
- Explore community prompts
- Clean modern UI (Tailwind CSS)
- User authentication (JWT)
- Flask + OpenAI integration for suggestions

---

## 🧠 Tech Stack

| Layer       | Tech                                 |
|-------------|--------------------------------------|
| Frontend    | React, Vite, Tailwind CSS, React Router |
| Backend     | Node.js, Express.js, MongoDB, Mongoose |
| AI Service  | Flask, Python, OpenAI GPT-3.5        |
| Auth        | JWT (Firebase Auth planned)           |
| Deployment  | Vercel, Render, MongoDB Atlas        |

---

## 🚀 Setup Instructions

**Each service runs in its own terminal window:**

```bash
# 1. Frontend
cd client
npm install
npm run dev

# 2. Backend (API server)
cd ../server
npm install
npm start

# 3. Flask AI Service
cd ../flask-ai
pip install -r requirements.txt
python app.py
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## 📬 Contact

For questions or feedback, open an issue or reach out to vishalm8656@gmail.com.
