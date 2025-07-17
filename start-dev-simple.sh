#!/bin/bash

echo "🚀 Starting PromptPal development environment..."

# Navigate to the root directory
cd "$(dirname "$0")"

# Start Node.js server
echo "🔧 Starting Node.js server..."
cd server
npm start &
SERVER_PID=$!
cd ..

# Start React frontend
echo "🔧 Starting React frontend..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

# Start Flask backend
echo "🔧 Starting Flask backend..."
cd flask-backend
python3 app.py || python app.py &
FLASK_PID=$!
cd ..

echo "✨ All servers are running!"
echo "   Node.js server: http://localhost:5000"
echo "   React frontend: http://localhost:5173"
echo "   Flask backend: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all servers."

# Handle clean shutdown
trap 'kill $SERVER_PID $CLIENT_PID $FLASK_PID; echo "Shutting down servers..."; exit' INT

# Wait for user to press Ctrl+C
wait
