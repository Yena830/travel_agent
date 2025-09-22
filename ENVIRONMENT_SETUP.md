# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Google Maps API Key (for Places Autocomplete)
VITE_GOOGLE_MAP_PLACE_API_KEY=your_google_maps_api_key_here

# Unsplash API Key (for city images)
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# Firebase Configuration (these are safe to expose)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## How to Get API Keys

### 1. Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Places API" and "Maps JavaScript API"
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Unsplash API Key
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy the Access Key from your application

### 3. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Copy the config values from your web app

## Security Notes

- **Never commit `.env` files to version control**
- The `.env` file is already added to `.gitignore`
- Only commit `.env.example` or documentation files
- For production, set environment variables in your hosting platform

## Local Development

1. Copy the environment variables above
2. Create a `.env` file in the root directory
3. Paste and fill in your actual API keys
4. Restart your development server

```bash
npm run dev
```
