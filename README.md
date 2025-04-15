# Personal Journal Microservice Web Application

A full-stack web application for managing personal journal entries with user authentication and authorization.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete journal entries
- Search and filter journal entries
- Tag journal entries with mood and custom tags
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker, Docker Compose

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for local development without Docker)
- [MongoDB](https://www.mongodb.com/) (for local development without Docker)

## Running Locally with Docker Compose

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd personal-journal-microservice
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   # MongoDB Configuration
   MONGO_USERNAME=admin
   MONGO_PASSWORD=password123
   MONGO_URI=mongodb://admin:password123@mongo:27017/journal?authSource=admin

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30

   # Node Environment
   NODE_ENV=production
   PORT=5000
   ```

3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

5. Stop the containers:
   ```bash
   docker-compose down
   ```

## Running Locally without Docker

### Backend

1. Navigate to the backend directory:
   ```bash
   cd personal-journal-microservice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/personal-journal
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd personal-journal-microservice/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Access the frontend at http://localhost:5173

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Journal Endpoints

- `GET /api/journal` - Get all journal entries for the authenticated user
- `POST /api/journal` - Create a new journal entry
- `GET /api/journal/:id` - Get a single journal entry
- `PUT /api/journal/:id` - Update a journal entry
- `DELETE /api/journal/:id` - Delete a journal entry

## License

[MIT](LICENSE)
