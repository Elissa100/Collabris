# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Collabris is a full-stack collaboration application built with:
- **Backend**: Spring Boot 3.2.0 with Java 17, PostgreSQL, JWT authentication, WebSocket messaging
- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS, Material-UI, Redux Toolkit

The application features team management, project collaboration, real-time chat, role-based access control, and comprehensive API documentation.

## Development Commands

### Backend (Spring Boot)
```bash
# Navigate to backend directory
cd backend

# Run the application
mvn spring-boot:run

# Run tests
mvn test

# Clean and build
mvn clean package

# Skip tests during build
mvn clean package -DskipTests
```

### Frontend (React + Vite)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

### Root-level Frontend Commands
The root directory also contains a simplified React setup:
```bash
# Run development server (root)
npm run dev

# Build (root)
npm run build

# Lint (root)
npm run lint
```

## Architecture Overview

### Backend Structure (`backend/src/main/java/com/collabris/`)
- **`config/`**: Security, WebSocket, Swagger configuration, data initialization
- **`controller/`**: REST API endpoints (Auth, Chat, Project, Team, User)
- **`dto/`**: Data Transfer Objects for requests and responses
- **`entity/`**: JPA entities (User, Team, Project, ChatRoom, ChatMessage, Role)
- **`security/`**: JWT authentication and authorization components
- **`service/`**: Business logic services
- **`repository/`**: Data access layer using Spring Data JPA
- **`exception/`**: Global exception handling

### Frontend Structure (`frontend/src/`)
- **`components/`**: Reusable React components organized by feature
  - `Auth/`: Authentication components and protected routes
  - `Common/`: Shared utility components (LoadingSpinner, StatsCard)
  - `Layout/`: Layout components (Navbar, main Layout)
- **`pages/`**: Route-based page components
  - `Auth/`: Login and registration pages
  - `Dashboard/`: Admin and user dashboard views
  - `Profile/`, `Settings/`: User management pages
- **`services/`**: API integration and service layers
- **`store/`**: Redux Toolkit store with feature slices (auth, theme, user)
- **`theme/`**: Material-UI theme configuration

## Key Configuration Files

### Backend Configuration
- **`application.properties`**: Database, JWT, CORS, file upload, email settings
- **`pom.xml`**: Maven dependencies including Spring Boot starters, PostgreSQL, JWT, Swagger

### Frontend Configuration  
- **`package.json`**: React, TypeScript, Material-UI, Redux Toolkit, React Router dependencies
- **`vite.config.ts`**: Vite configuration with React plugin
- **`tailwind.config.js`**: TailwindCSS styling configuration
- **`tsconfig.json`**: TypeScript compiler configuration

## Database Setup

The application uses PostgreSQL with connection details in `application.properties`. The current setup uses a Neon database instance. For local development:

1. Install PostgreSQL
2. Create database: `collabris_db`
3. Update connection settings in `application.properties`
4. Application will auto-create tables via Hibernate DDL

## API Documentation

When the backend is running, access Swagger documentation at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs

## Authentication

The application uses JWT-based authentication with role-based access control:
- **ADMIN**: Full system access
- **MANAGER**: Team and project management
- **MEMBER**: Basic user access

Include JWT token in requests: `Authorization: Bearer <token>`

## Real-time Features

WebSocket messaging is implemented using STOMP protocol:
- **Connection endpoint**: `/ws`
- **Send messages**: `/app/chat.sendMessage`
- **Subscribe to room**: `/topic/chat/{roomId}`

## Testing

### Backend Tests
```bash
cd backend
mvn test
```
Includes unit tests, integration tests, and security tests with H2 in-memory database for testing.

### Frontend Testing
Currently no test configuration is set up in the frontend package.json.

## Development Workflow

1. **Backend Development**: Start with entity design, then repository, service, and controller layers
2. **Frontend Development**: Use Redux slices for state management, Material-UI for components
3. **API Integration**: Services in `frontend/src/services/` handle API calls to backend
4. **Authentication Flow**: JWT tokens managed in Redux auth slice with persistent storage

## Port Configuration

- **Backend**: http://localhost:8080
- **Frontend**: http://localhost:5173 (Vite dev server)
- **CORS**: Backend allows origin `http://localhost:5173`

## Key Dependencies

### Backend
- Spring Boot 3.2.0 (Web, Security, Data JPA, WebSocket, Validation)
- PostgreSQL driver
- JWT (jjwt 0.12.3)
- SpringDoc OpenAPI 3.0

### Frontend
- React 18.3.1 with TypeScript
- Material-UI 5.15.1 for components
- Redux Toolkit for state management
- React Router 6.20.1 for routing
- Axios for API calls
- React Hook Form with Yup validation

## File Structure Notes

- Dual frontend setup: Root-level basic React app and `frontend/` directory with full application
- Backend follows standard Spring Boot Maven structure
- Configuration files are environment-specific via Spring profiles
