# Deployment Guide

## GitHub Setup

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Smart Trip AI Travel Planner"
```

### 2. Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Don't initialize with README, .gitignore, or license (we already have them)

### 3. Connect Local Repository to GitHub
```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

## Environment Variables for Production

### Vercel Deployment
1. Go to [Vercel](https://vercel.com) and import your GitHub repository
2. In Project Settings > Environment Variables, add:
   - `VITE_GOOGLE_MAP_PLACE_API_KEY`
   - `VITE_UNSPLASH_ACCESS_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### Netlify Deployment
1. Go to [Netlify](https://netlify.com) and connect your GitHub repository
2. In Site Settings > Environment Variables, add the same variables as above

### Other Platforms
Most hosting platforms support environment variables. Add the same variables listed above.

## Security Checklist

- ✅ `.env` file is in `.gitignore`
- ✅ No sensitive data in committed files
- ✅ Environment variables documented in `ENVIRONMENT_SETUP.md`
- ✅ API keys restricted to your domain (for Google Maps)

## Build and Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The dist/ folder contains your production build
```

## Important Notes

1. **Never commit `.env` files** - they contain sensitive API keys
2. **Set environment variables in your hosting platform** - not in the code
3. **Restrict API keys** - especially Google Maps API key to your domain
4. **Test locally first** - make sure everything works with your `.env` file
