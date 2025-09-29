# Collabris Backend

A comprehensive Spring Boot backend for the Collabris collaboration application.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user registration, login, and profile management
- **Team Management**: Create and manage teams with member assignments
- **Project Management**: Project creation, assignment, and tracking
- **Real-time Chat**: WebSocket-based messaging system with STOMP protocol
- **API Documentation**: Swagger/OpenAPI 3.0 documentation
- **Database**: PostgreSQL with JPA/Hibernate
- **Security**: Spring Security with JWT tokens
- **Testing**: Unit and integration tests

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security with JWT
- **Database**: PostgreSQL with JPA/Hibernate
- **WebSocket**: STOMP over WebSocket for real-time messaging
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: JUnit 5, Spring Boot Test
- **Build Tool**: Maven

## Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

## Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE collabris_db;
CREATE USER collabris_user WITH PASSWORD 'collabris_pass';
GRANT ALL PRIVILEGES ON DATABASE collabris_db TO collabris_user;
```

2. The application will automatically create tables on startup using Hibernate DDL.

## Configuration

The application is configured via `application.properties`. Key configurations:

- **Database**: PostgreSQL connection settings
- **JWT**: Secret key and expiration time
- **CORS**: Allowed origins for frontend
- **File Upload**: Maximum file sizes
- **Email**: SMTP configuration for notifications

## Running the Application

1. Clone the repository
2. Navigate to the backend directory
3. Run the application:

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Documentation

Once the application is running, access the Swagger UI at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login

### User Management
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (Admin only)

### Team Management
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `PUT /api/teams/{id}` - Update team
- `DELETE /api/teams/{id}` - Delete team
- `POST /api/teams/{teamId}/members/{userId}` - Add member to team

### Project Management
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/{projectId}/members/{userId}` - Add member to project

### Chat System
- `GET /api/chat/rooms` - Get all chat rooms
- `POST /api/chat/rooms` - Create chat room
- `GET /api/chat/rooms/{roomId}/messages` - Get messages
- `POST /api/chat/messages` - Send message

### WebSocket Endpoints
- `/ws` - WebSocket connection endpoint
- `/app/chat.sendMessage` - Send message via WebSocket
- `/topic/chat/{roomId}` - Subscribe to room messages

## Security

The application uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Roles
- **ADMIN**: Full system access
- **MANAGER**: Team and project management
- **MEMBER**: Basic user access

## Testing

Run tests with:

```bash
mvn test
```

The test suite includes:
- Unit tests for services and controllers
- Integration tests for API endpoints
- Security tests for authentication and authorization

## Database Schema

The application creates the following main entities:
- **Users**: User accounts with authentication
- **Roles**: User roles for access control
- **Teams**: User groups for collaboration
- **Projects**: Work projects with team assignments
- **ChatRooms**: Communication channels
- **ChatMessages**: Individual messages

## WebSocket Configuration

Real-time messaging is implemented using STOMP over WebSocket:
- **Connection**: `/ws` endpoint with SockJS fallback
- **Message Broker**: Simple broker for `/topic` and `/queue`
- **Application Prefix**: `/app` for client messages

## Error Handling

Global exception handling provides consistent error responses:
- Validation errors with field-specific messages
- Authentication and authorization errors
- Custom business logic exceptions
- Generic error handling for unexpected issues

## Development

### Adding New Features

1. Create entity classes in `com.collabris.entity`
2. Add repository interfaces in `com.collabris.repository`
3. Implement service classes in `com.collabris.service`
4. Create controller classes in `com.collabris.controller`
5. Add DTOs in `com.collabris.dto`
6. Write tests in `src/test/java`

### Code Structure

```
src/main/java/com/collabris/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
├── entity/         # JPA entities
├── exception/      # Exception handling
├── repository/     # Data repositories
├── security/       # Security configuration
└── service/        # Business logic services
```

## Production Deployment

For production deployment:

1. Update `application.properties` with production database settings
2. Change JWT secret to a secure random value
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Configure logging levels
6. Set up monitoring and health checks

## Contributing

1. Follow Spring Boot best practices
2. Write comprehensive tests
3. Document API changes in Swagger annotations
4. Follow the existing code structure and naming conventions
5. Ensure security considerations are addressed

## License

This project is licensed under the Apache License 2.0.