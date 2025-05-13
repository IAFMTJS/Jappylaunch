# Deployment Guide

## Environment Variables Setup

### Required Environment Variables
The following environment variables are required for the application to function properly in production:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Setting up Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your project
3. Navigate to Site settings > Environment variables
4. Add each of the required environment variables listed above
5. For each variable:
   - Click "Add variable"
   - Enter the variable name (e.g., `REACT_APP_FIREBASE_API_KEY`)
   - Enter the corresponding value from your Firebase project
   - Click "Save"

### Getting Firebase Configuration Values

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the gear icon (⚙️) next to "Project Overview" to open Project settings
4. Scroll down to the "Your apps" section
5. Under the web app configuration, you'll find all the required values:
   - `apiKey` → `REACT_APP_FIREBASE_API_KEY`
   - `authDomain` → `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `REACT_APP_FIREBASE_PROJECT_ID`
   - `storageBucket` → `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `REACT_APP_FIREBASE_APP_ID`

### Verifying Environment Variables

After setting up the environment variables:

1. Go to your Netlify dashboard
2. Navigate to Deploys
3. Click "Trigger deploy" > "Deploy site"
4. Monitor the build logs to ensure the environment variables are properly loaded
5. The verification script (`scripts/verify-env.js`) will check for the presence of all required variables

### Troubleshooting

If you encounter build failures related to environment variables:

1. Verify that all required variables are set in the Netlify dashboard
2. Check that the variable names match exactly (they are case-sensitive)
3. Ensure there are no extra spaces in the variable values
4. Try redeploying the site after confirming the variables are set correctly

### Local Development

For local development, create a `.env.local` file in the project root with the same variables. This file should not be committed to version control.

Example `.env.local`:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Note: Make sure to add `.env.local` to your `.gitignore` file to prevent committing sensitive information. 