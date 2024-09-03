# Mailsense AI Backend

## Overview

The Mailsense AI Backend is a Node.js application designed to provide backend services for the Mailsense AI platform. It includes functionalities for handling email operations, integrating with external APIs, and managing user authentication.

## Dependencies

The project uses the following dependencies:

- **axios**: ^1.7.5
- **bcrypt**: ^5.1.1
- **bullmq**: ^5.12.12
- **cors**: ^2.8.5
- **dotenv**: ^16.4.5
- **express**: ^4.19.2
- **googleapis**: ^143.0.0
- **ioredis**: ^5.4.1
- **jsonwebtoken**: ^9.0.2
- **mongodb**: ^6.8.0
- **mongoose**: ^8.5.4
- **nodemon**: ^3.1.4
- **openai**: ^4.56.1
- **uuid**: ^10.0.0

## Installation Guide


### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (for database operations)
- [npm](https://www.npmjs.com/) (Node Package Manager)

#### Step 1: Clone the Repository

Open your terminal and run the following command:

```bash
git clone git@github.com:abhishekshah5486/mailsense-ai-backend.git
```
#### Step 2: Navigate to the project directory

```bash
cd mailsense-ai-backend
```

#### Step 3: Install the dependencies

```bash
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory of the project with the following content:

```env
MONGO_URL=your_mongodb_connection_url
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLEAUTH_REDIRECT_URI=your_google_auth_redirect_uri
TOPIC_NAME=your_topic_name
PROJECT_ID=your_project_id
JWT_SECRET=your_jwt_secret
```

## Running the Application

To start the application in production mode, use:

```bash
node index.js
```

For development mode with auto-reloading, use:
```bash
npm run dev
```

## Scripts

- **start**: `node index.js` - Starts the application in production mode.
- **dev**: `nodemon index.js` - Starts the application in development mode with auto-reloading.

## License

This project is licensed under the ISC License.

We welcome contributions to the Mailsense AI Backend project!
For any issues or questions, feel free to open an issue on the GitHub repository https://github.com/abhishekshah5486/mailsense-ai-backend.

