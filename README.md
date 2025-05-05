[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)
# React TypeScript Vite Project

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)
# React TypeScript Vite Project

A modern web application built with React, TypeScript, and Vite, featuring Firebase authentication and a beautiful UI powered by Tailwind CSS.

##  Features

-  Built with Vite for fast development and optimized production builds
-  Firebase Authentication integration
-  Modern UI with Tailwind CSS
-  Responsive design
-  Testing with Cypress
-  ESLint for code quality
-  TypeScript for type safety

##  Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)

##  Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd [your-project-name]
```

2. Install dependencies:
```bash
cd frontend
npm install
```

##  Configuration

1. Create a `.env` file in the `frontend` directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

##  Development

To start the development server:

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

##  Building for Production

To create a production build:

```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist` directory.

##  Testing

Run Cypress tests:

```bash
cd frontend
npm run cypress
```

##  Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run cypress` - Run Cypress tests

##  Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Firebase
- React Router
- Cypress
- ESLint

##  Project Structure

```
frontend/
├── src/            # Source files
├── public/         # Static assets
├── cypress/        # Test files
├── dist/           # Production build
└── node_modules/   # Dependencies
```

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License
This project is licensed under the MIT License  Copyright (c) 2025 PANDUKAWIJESINGHE

