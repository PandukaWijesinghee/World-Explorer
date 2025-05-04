# Countries App Documentation

## Table of Contents
1. [Overview](#overview)
2. [API Documentation](#api-documentation)
3. [Authentication](#authentication)
4. [Data Models](#data-models)
5. [Features](#features)
6. [Error Handling](#error-handling)
7. [Development Guide](#development-guide)
8. [Testing](#testing)
9. [Deployment](#deployment)

## Overview

The Countries App is a modern web application that provides detailed information about countries worldwide. It features a responsive UI, real-time search, and user authentication with Firebase. The application uses the REST Countries API as its primary data source, with fallback data for offline access.

## API Documentation

### Base URL
```
/api
```

### Endpoints

#### 1. Get All Countries
```typescript
GET /all
```
Returns a list of all countries with essential information.

**Response:**
```typescript
Country[] // Array of Country objects
```

#### 2. Search Countries by Name
```typescript
GET /name/{name}
```
Searches for countries by name (common or official).

**Parameters:**
- `name`: string - The name to search for

**Response:**
```typescript
Country[] // Array of matching Country objects
```

#### 3. Get Countries by Region
```typescript
GET /region/{region}
```
Returns all countries in a specific region.

**Parameters:**
- `region`: string - The region name (e.g., "Europe", "Asia")

**Response:**
```typescript
Country[] // Array of Country objects in the specified region
```

#### 4. Get Country by Code
```typescript
GET /alpha/{code}
```
Returns detailed information about a specific country.

**Parameters:**
- `code`: string - The country code (cca2, cca3, or cioc)

**Response:**
```typescript
Country // Single Country object
```

#### 5. Get Multiple Countries by Codes
```typescript
GET /alpha?codes={codes}
```
Returns information about multiple countries specified by their codes.

**Parameters:**
- `codes`: string - Comma-separated list of country codes

**Response:**
```typescript
Country[] // Array of Country objects
```

### Error Handling
The API includes comprehensive error handling:
- Timeout after 10 seconds
- Fallback to local data when API is unavailable
- Proper error logging
- Graceful degradation

## Authentication

The application uses Firebase Authentication for user management. Features include:
- Email/Password authentication
- User session management
- Protected routes
- User preferences storage

### Firebase Configuration
Required environment variables:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Data Models

### Country
```typescript
interface Country {
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  favoriteCountries: string[];
}
```

## Features

### 1. Country Search
- Real-time search by country name
- Filter by region
- Detailed country information display

### 2. User Features
- User authentication
- Favorite countries management
- User preferences

### 3. UI Features
- Responsive design
- Dark/Light mode
- Interactive maps
- Country flags and coat of arms

## Error Handling

The application implements several error handling strategies:
1. API Error Handling
   - Timeout management
   - Fallback data
   - Error logging
2. User Error Handling
   - Form validation
   - Error messages
   - Loading states

## Development Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start development server: `npm run dev`

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run cypress` - Run Cypress tests

## Testing

The application uses Cypress for end-to-end testing. Tests cover:
- User authentication
- Country search functionality
- API integration
- UI components


## Deployment

### Production Build
1. Create production build: `npm run build`
2. Deploy the contents of the `dist` directory

### Environment Variables
Ensure all required environment variables are set in the production environment.

### Performance Optimization
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. Copyright (c) 2025 PANDUKAWIJESINGHE