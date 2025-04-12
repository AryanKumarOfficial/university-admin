# University Admin Portal

A Next.js application for university administration with Firebase authentication and Firestore database.

## Table of Contents

- [First-Time Setup](#first-time-setup)
  - [Prerequisites](#prerequisites)
  - [Project Setup](#project-setup)
  - [Firebase Setup](#firebase-setup)
  - [Environment Configuration](#environment-configuration)
  - [Firebase Admin Setup](#firebase-admin-setup)
- [Creating the First Admin User](#creating-the-first-admin-user)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [Deploying to Vercel](#deploying-to-vercel)
  - [Prerequisites](#prerequisites-1)
  - [Deployment Steps](#deployment-steps)
  - [Custom Domain](#custom-domain-optional)
  - [Continuous Deployment](#continuous-deployment)
  - [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

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

#### Generating a Strong JWT Secret

To generate a secure random JWT secret, you can use OpenSSL:

```bash
# This command works on macOS, Linux, and Windows (with OpenSSL installed)
openssl rand -hex 32
```

**Platform Notes:**
- **Windows users**: If OpenSSL isn't installed, you can:
  - Install it via [Chocolatey](https://chocolatey.org/): `choco install openssl`
  - Or download from [OpenSSL for Windows](https://slproweb.com/products/Win32OpenSSL.html)
- **macOS/Linux users**: OpenSSL is typically pre-installed

Copy the generated string and use it as your `NEXT_PUBLIC_JWT_SECRET` value.

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

## Deploying to Vercel

Follow these steps to deploy your university admin portal to Vercel:

### Prerequisites

- [Vercel account](https://vercel.com/signup)
- Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

1. **Push your code to a Git repository**

   Ensure your code is pushed to a Git repository on GitHub, GitLab, or Bitbucket.

2. **Import your repository to Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Select your Git provider and the repository
   - Click "Import"

3. **Configure project settings**

   - Framework Preset: Select "Next.js"
   - Root Directory: Leave as default if your project is in the root directory
   - Build Command: Verify it's set to `next build` (should be detected automatically)

4. **Configure environment variables**

   Add the same environment variables from your `.env.local` file:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
   NEXT_PUBLIC_JWT_SECRET
   ```

5. **Handle Firebase Admin Service Account**

   For the Firebase Admin SDK credentials, you have two options:

   - **Option 1**: Store the entire service account JSON content in an environment variable (recommended for security):
     - Create a new environment variable called `FIREBASE_SERVICE_ACCOUNT_KEY`
     - Copy the entire content of your `service_account.json` file and paste it as the value

   - **Option 2**: Encrypt the service account file and include it in your repository (less recommended):
     - Use a secure method to encrypt your service account file
     - Add decryption steps to your build process

6. **Dependency Considerations**

   If you encounter Firebase dependency conflicts during deployment, check your `firebase-admin` version. You may need to downgrade to version 12.0.0:

   ```bash
   npm install firebase-admin@12.0.0
   # or
   yarn add firebase-admin@12.0.0
   # or
   pnpm add firebase-admin@12.0.0
   ```

7. **Deploy the project**

   - Click "Deploy"
   - Wait for the build and deployment to complete
   - Vercel will provide you with a URL to access your deployed application

### Custom Domain (Optional)

1. Go to your project settings in Vercel Dashboard
2. Navigate to "Domains"
3. Add your custom domain and follow the instructions to configure DNS settings

### Continuous Deployment

By default, Vercel will automatically deploy changes whenever you push to your Git repository. You can configure branch deployments and preview environments in your project settings.

### Troubleshooting

- If your build fails, check the build logs in Vercel for detailed error messages
- Ensure all environment variables are correctly set
- Verify your Firebase service account has the correct permissions

## Maintenance

### Developed and Maintained by

IQnaut Development Team  
Contact: admin@iqnaut.com

### Version

Current Version: 1.0.0 (April 2025)

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### License

This project is licensed under the [MIT License](LICENSE).
