#!/bin/bash

echo "🔍 Checking system requirements..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3:"
    echo "   sudo apt update"
    echo "   sudo apt install python3 python3-pip"
    exit 1
else
    PYTHON="python3"
    echo "✅ Python 3 is installed."
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    if ! command -v pip &> /dev/null; then
        echo "❌ pip is not installed. Please install pip:"
        echo "   sudo apt install python3-pip"
        exit 1
    else
        PIP="pip"
    fi
else
    PIP="pip3"
fi
echo "✅ pip is installed as $PIP"

# Install required packages
echo "📦 Installing required Python packages..."
$PIP install flask flask-cors openai python-dotenv

# Install Node.js packages
echo "📦 Installing required Node.js packages..."
npm install --prefix ./client
npm install --prefix ./server

echo "🚀 Setup complete! You can now run the development server:"
echo "   ./start-dev-simple.sh"
echo "This will start all three components: Node.js server, React frontend, and Flask backend."
