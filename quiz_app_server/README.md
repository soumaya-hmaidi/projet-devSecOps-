# Quiz App API - Server Documentation

A comprehensive quiz application backend API built with Node.js, Express, Prisma, and MySQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

## ✨ Features

- 🔐 JWT-based authentication
- 👤 Role-based access control (Admin/Student)
- 📝 Quiz creation and management
- ✅ Multiple question types (Multiple Choice, True/False, Text)
- 📊 Quiz attempt tracking and scoring
- 📈 Statistics and analytics
- 🛡️ Input validation and error handling
- 🔒 Authorization checks

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Logging**: Morgan
- **CORS**: cors

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="mysql://root@localhost:3306/quiz_app"
   JWT_SECRET="your-secret-key-here"
   PORT=5000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # (Optional) Seed the database
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "STUDENT"
}
```

#### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Quizzes

#### Get All Quizzes (Active)
```
GET /api/quizzes
Headers: Authorization: Bearer <token>
```

#### Get Quiz by ID
```
GET /api/quizzes/:id
Headers: Authorization: Bearer <token>
```

#### Create Quiz (Admin Only)
```
POST /api/quizzes
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "title": "Geography Quiz",
  "description": "Test your geography knowledge",
  "questions": [
    {
      "question": "What is the capital of France?",
      "type": "MULTIPLE_CHOICE",
      "points": 2,
      "options": [
        { "text": "Paris", "isCorrect": true, "order": 1 },
        { "text": "London", "isCorrect": false, "order": 2 },
        { "text": "Berlin", "isCorrect": false, "order": 3 }
      ]
    }
  ]
}
```

#### Update Quiz (Admin Only)
```
PUT /api/quizzes/:id
Headers: Authorization: Bearer <token>
```

#### Delete Quiz (Admin Only)
```
DELETE /api/quizzes/:id
Headers: Authorization: Bearer <token>
```

### Attempts

#### Start Quiz Attempt
```
POST /api/attempts/start
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "quizId": 1
}
```

#### Submit Answer
```
POST /api/attempts/:attemptId/answers
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "questionId": 1,
  "optionId": 2,
  "textAnswer": "Optional text for TEXT type questions"
}
```

#### Complete Quiz
```
POST /api/attempts/:attemptId/complete
Headers: Authorization: Bearer <token>
```

#### Get User's Attempts
```
GET /api/attempts/my-attempts
Headers: Authorization: Bearer <token>
```

#### Get Attempt by ID
```
GET /api/attempts/:attemptId
Headers: Authorization: Bearer <token>
```

### Questions (Admin Only)

#### Get Question by ID
```
GET /api/admin/questions/:id
Headers: Authorization: Bearer <token>
```

#### Create Question
```
POST /api/admin/questions
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "question": "What is JavaScript?",
  "type": "MULTIPLE_CHOICE",
  "points": 2,
  "order": 1,
  "quizId": 1,
  "options": [
    { "text": "A programming language", "isCorrect": true, "order": 1 },
    { "text": "A database", "isCorrect": false, "order": 2 }
  ]
}
```

#### Update Question
```
PUT /api/admin/questions/:id
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "question": "Updated question text?",
  "type": "MULTIPLE_CHOICE",
  "points": 3,
  "order": 1,
  "options": [
    { "text": "Option 1", "isCorrect": true, "order": 1 },
    { "text": "Option 2", "isCorrect": false, "order": 2 }
  ]
}
```

#### Delete Question
```
DELETE /api/admin/questions/:id
Headers: Authorization: Bearer <token>
```

### Options (Admin Only)

#### Get Option by ID
```
GET /api/admin/options/:id
Headers: Authorization: Bearer <token>
```

#### Create Option
```
POST /api/admin/options/questions/:questionId
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "text": "Option text",
  "isCorrect": false,
  "order": 1
}
```

#### Update Option
```
PUT /api/admin/options/:id
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "text": "Updated option text",
  "isCorrect": true,
  "order": 2
}
```

#### Delete Option
```
DELETE /api/admin/options/:id
Headers: Authorization: Bearer <token>
```

#### Get All Options for a Question
```
GET /api/admin/options/questions/:questionId/all
Headers: Authorization: Bearer <token>
```

### Statistics (Admin Only)

#### Get Dashboard Stats
```
GET /api/admin/dashboard/stats
Headers: Authorization: Bearer <token>
```

#### Get Quiz Analytics
```
GET /api/admin/analytics/quiz/:id
Headers: Authorization: Bearer <token>
```

#### Get User Analytics
```
GET /api/admin/analytics/user/:id
Headers: Authorization: Bearer <token>
```

#### Get System Analytics
```
GET /api/admin/analytics/system
Headers: Authorization: Bearer <token>
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **ADMIN**: Can create/edit/delete quizzes, view statistics, manage questions and options
- **STUDENT**: Can take quizzes and view their attempts

## 💾 Database Schema

### Models

- **User**: Users with email, password, name, role
- **Quiz**: Quizzes with title, description, active status
- **Question**: Questions with text, type, points, order
- **Option**: Answer options for questions
- **QuizAttempt**: User attempts on quizzes
- **Answer**: User's answers to questions

### Relationships

- User → Quiz (one-to-many)
- Quiz → Question (one-to-many)
- Question → Option (one-to-many)
- User → QuizAttempt (one-to-many)
- Quiz → QuizAttempt (one-to-many)
- QuizAttempt → Answer (one-to-many)
- Question → Answer (one-to-many)
- Option → Answer (one-to-many)

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | - |
| `JWT_SECRET` | Secret key for JWT tokens | - |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |

## 📁 Project Structure

```
server/
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── quizController.js
│   ├── questionController.js
│   ├── optionController.js
│   ├── attemptController.js
│   └── statsController.js
├── middleware/           # Middleware functions
│   ├── auth.js
│   ├── errorHandler.js
│   └── validationErrorHandler.js
├── routes/              # Route definitions
│   ├── auth.js
│   ├── quizzes.js
│   ├── questions.js
│   ├── options.js
│   ├── attempts.js
│   ├── stats.js
│   └── admin.js
├── validators/          # Input validation
│   ├── authValidator.js
│   ├── quizValidator.js
│   ├── questionValidator.js
│   ├── optionValidator.js
│   └── attemptValidator.js
├── prisma/              # Database configuration
│   ├── schema.prisma
│   └── seed.js
├── utils/               # Utility functions
│   └── response.js
└── index.js             # Entry point
```

## 🧪 Available Scripts

```bash
# Start server
npm start

# Development mode with auto-reload
npm run dev

# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

## 📝 Question Types

1. **MULTIPLE_CHOICE**: Questions with multiple option choices
2. **TRUE_FALSE**: Binary true/false questions
3. **TEXT**: Free-text answer questions

## 🎯 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors */ ]
}
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- SQL injection protection via Prisma
- CORS enabled

## 📊 Health Check

```
GET /api/health
```

Returns server status and environment information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC

## 👨‍💻 Author

Ben Br

---

For more information about the Prisma schema and database setup, see the `prisma/schema.prisma` file.

