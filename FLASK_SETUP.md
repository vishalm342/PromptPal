# Flask Backend Setup Instructions

This document provides clear instructions on how to set up and run the Flask backend for the PromptPal application.

## Prerequisites

- Python 3.8+ installed
- pip package manager

## Setup Steps

1. **Install required Python packages**:

   ```bash
   # Install pip if not already installed
   sudo apt install python3-pip
   
   # Install the required packages
   pip3 install flask flask-cors openai python-dotenv
   ```

2. **Configure the `.env` file**:

   Make sure the Flask backend `.env` file has your OpenAI API key:
   ```
   # Flask Backend Configuration
   FLASK_PORT=5001
   FLASK_DEBUG=True
   
   # OpenAI API Key
   OPENAI_API_KEY=your_api_key_here
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173
   ```

## Running the Backend

You can run the Flask backend using one of these methods:

1. **Direct command**:
   ```bash
   cd flask-backend
   python3 app.py
   ```

2. **Using the start-dev-simple.sh script**:
   ```bash
   ./start-dev-simple.sh
   ```
   This will start the Flask backend along with the React frontend and Node.js server.

## Testing the API

Once the Flask backend is running, you can test it with:

```bash
cd flask-backend
python3 test_api.py
```

## Running the Complete Application

To run all components (React frontend, Node.js backend, and Flask backend) in one terminal:

```bash
./start-dev-simple.sh
```

This script will start all three services and provide URLs to access each one.
