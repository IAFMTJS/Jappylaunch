# Japanese Vocabulary Quiz

A modern web application for learning Japanese vocabulary by section, built with React, TypeScript, and Firebase.

## Features

- Learn Japanese vocabulary organized by sections
- Interactive quizzes and exercises
- Progress tracking
- Offline support
- User authentication
- Responsive design
- Dark/Light theme support

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/japanese-vocabulary-quiz.git
   cd japanese-vocabulary-quiz
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.template` to `.env.local`
   - Fill in your Firebase configuration values
   - Never commit `.env.local` to version control

4. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here

# Environment
NODE_ENV=development
REACT_APP_USE_EMULATORS=false

# Feature Flags
REACT_APP_ENABLE_OFFLINE_MODE=true
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_ANALYTICS=false
```

## Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm run build:analyze` - Build and analyze bundle size
- `npm run build:debug` - Build with detailed debugging information
- `npm test` - Run tests
- `npm run clean` - Clean build cache
- `npm run generate-pwa-assets` - Generate PWA assets
- `npm run generate-romaji` - Generate romaji data

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── pages/         # Page components
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── App.tsx        # Root component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All Firebase credentials are stored in environment variables
- Security headers are configured for production
- Content Security Policy is implemented
- Authentication state is properly managed
- Offline data is encrypted

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Kuroshiro](https://github.com/hexenq/kuroshiro) for Japanese text processing 