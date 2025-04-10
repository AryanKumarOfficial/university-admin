# University Admin Portal

A Next.js application for university administration with Firebase authentication and Firestore database.

## First-Time Setup

### Prerequisites

- Node.js 18.x or higher
- Firebase account with Firestore and Authentication enabled
- Firebase Admin SDK service account credentials

### Project Setup

1. Clone the repository

```bash
git clone <repository-url>
cd university-admin
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firebase Authentication with Email/Password provider
3. Create a Firestore database
4. Generate a Firebase Admin SDK service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file

### Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# JWT Secret for Authentication
NEXT_PUBLIC_JWT_SECRET=your_strong_secret_key
```

### Firebase Admin Setup

1. Create the service account file:
   - Place your downloaded Firebase Admin SDK JSON key at `src/lib/firebase/service_account.json`

## Creating the First Admin User

To access the application, you need to create your first admin user through the API:

1. Start the development server:

```bash
npm run dev
```

2. Use an API client like Postman or curl to make a POST request to create your first admin user:

```
POST http://localhost:3000/api/users/create
```

With JSON body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "phone": "+1234567890", 
  "password": "securepassword",
  "role": "Admin",
  "createdBy": "system",
  "createdAt": "2025-04-09T00:00:00.000Z"
}
```

> **Note:** In development mode, authentication is bypassed for this API. In production, you'll need to have a valid JWT token with Admin role to create additional users.

3. After creating the admin user, you can log in to the application at http://localhost:3000/login

## Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app` - Next.js app router
- `/src/app/api` - API routes
- `/src/components` - React components
- `/src/lib/firebase` - Firebase configuration
- `/src/stores` - Zustand state management

## Authentication Flow

The application uses Firebase Authentication with custom JWT tokens:

1. Users authenticate with Firebase (email/password)
2. A custom JWT token with user role is created
3. This token is stored in cookies and used for API authentication
4. In production, all API routes and pages require valid authentication
