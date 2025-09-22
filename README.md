# 🌟 Smart Trip - AI Travel Planner

An AI-powered intelligent travel planning application that creates personalized travel itineraries for users. Built with React + Vite, integrated with Google Maps, Unsplash, and Firebase.

![Smart Trip](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF)
![Firebase](https://img.shields.io/badge/Firebase-10.14.1-FFCA28)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-38B2AC)

## ✨ Features

### 🎯 Core Features
- **AI Smart Planning**: Generate personalized travel itineraries based on user preferences
- **Google Maps Integration**: Location search and map positioning
- **City Image Display**: Showcase destination beauty using Unsplash API
- **User Authentication**: Google OAuth login system
- **Itinerary Management**: Create, view, edit, and share travel plans

### 🎨 UI Design
- **Modern Interface**: Clean design inspired by NewJeans aesthetic
- **Responsive Layout**: Perfect adaptation for mobile and desktop
- **Smooth Animations**: Fluid page transitions and interactive animations
- **Dark Theme**: Elegant deep blue color scheme

### 📱 User Experience
- **One-Click Generation**: Get complete itineraries in just a few steps
- **Real-time Preview**: Instantly view generated travel plans
- **PDF Export**: Download and share itinerary PDFs
- **Personal Profile**: Manage personal travel history and preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smart-trip.git
cd smart-trip
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy environment variables template
cp .env.example .env

# Edit .env file with your API keys
# See ENVIRONMENT_SETUP.md for details
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
Visit `http://localhost:5173`

## 🔧 Environment Configuration

### Required API Keys

| Service | Environment Variable | Purpose |
|---------|---------------------|---------|
| Google Maps | `VITE_GOOGLE_MAP_PLACE_API_KEY` | Location search and autocomplete |
| Unsplash | `VITE_UNSPLASH_ACCESS_KEY` | City image display |
| Firebase | `VITE_FIREBASE_*` | User authentication and data storage |

### Getting API Keys

For detailed API key setup instructions, see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)

## 📁 Project Structure

```
smart-trip/
├── src/
│   ├── components/          # React components
│   │   ├── custom/         # Custom components
│   │   └── ui/            # UI component library
│   ├── constants/         # Constants definition
│   ├── create-trip/       # Create trip page
│   ├── profile/           # User profile page
│   ├── service/           # Service layer
│   ├── view-trip/         # View trip page
│   └── utils/             # Utility functions
├── public/                # Static assets
├── .env.example          # Environment variables template
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind configuration
```

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3.1** - User interface framework
- **Vite 5.0.0** - Build tool and development server
- **React Router DOM** - Client-side routing

### Styling and UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Backend Services
- **Firebase** - User authentication and database
- **Google Maps API** - Maps and location services
- **Unsplash API** - Image services
- **Google Gemini AI** - AI itinerary generation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **html2canvas** - PDF generation

## 📖 User Guide

### Creating Travel Plans
1. Click the "Start Your Journey" button
2. Enter destination, travel days, budget, and other information
3. Select travel style and interest preferences
4. Click "Generate Itinerary" and wait for AI processing
5. View and save your personalized itinerary

### Managing Itineraries
- **View Itineraries**: Check all itineraries in your personal profile
- **Edit Itineraries**: Modify preferences for existing itineraries
- **Share Itineraries**: Share with friends via links or PDFs
- **Delete Itineraries**: Remove unwanted itineraries

## 🚀 Deployment Guide

### Vercel Deployment (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Automatic deployment completes

### Other Platforms
For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - User interface framework
- [Vite](https://vitejs.dev/) - Build tool
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Unsplash](https://unsplash.com/) - Image services
- [Google Maps](https://developers.google.com/maps) - Map services

## 📞 Contact

For questions or suggestions, please contact us through:

- Project Issues: [GitHub Issues](https://github.com/yourusername/smart-trip/issues)
- Email: your-email@example.com

---

⭐ If this project helped you, please give it a star!