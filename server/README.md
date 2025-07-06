# PromptPal Server API

Express.js backend with JWT authentication and MongoDB integration for the PromptPal application.

## Features

- JWT-based authentication
- bcrypt password hashing
- MongoDB with Mongoose ODM
- Protected prompt routes
- User registration and login
- CORS enabled

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Authentication Routes

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login
Login an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### GET /api/auth/me
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Prompt Routes (All require authentication)

All prompt routes require the `Authorization: Bearer <token>` header.

#### GET /api/prompts
Get all prompts for the authenticated user.

#### GET /api/prompts/:id
Get a specific prompt by ID.

#### POST /api/prompts
Create a new prompt.

**Request Body:**
```json
{
  "title": "Prompt Title",
  "content": "Prompt content here",
  "category": "Category Name",
  "tags": ["tag1", "tag2"]
}
```

#### PUT /api/prompts/:id
Update a prompt by ID.

#### DELETE /api/prompts/:id
Delete a prompt by ID.

## Running the Server

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env` file

3. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000` by default.

## Database Schema

### User Schema
- `username`: String (required, unique, 3-30 chars)
- `email`: String (required, unique, valid email format)
- `password`: String (required, min 6 chars, hashed with bcrypt)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

### Prompt Schema
- `title`: String (required)
- `content`: String (required)
- `category`: String (required)
- `tags`: Array of Strings
- `user`: ObjectId (reference to User, required)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

## Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT tokens with 7-day expiration
- Protected routes with authentication middleware
- User isolation (users can only access their own prompts)
- Input validation and sanitization
- Error handling and logging
