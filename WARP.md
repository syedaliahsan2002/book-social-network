# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repo overview
- Frontend: Angular app in `frontEnd/Book-network-ui`
- Backend: Spring Boot app in `book-social-network/book-netwok-api`
- Docker: build files in `docker/`, dev dependencies compose in `book-social-network/book-netwok-api/docker-compose.yml`

Common commands

Frontend (Angular, in `frontEnd/Book-network-ui`)
- Install deps
```bash path=null start=null
npm ci
```
- Start dev server (http://localhost:4200)
```bash path=null start=null
npm start
```
- Build
```bash path=null start=null
npm run build
```
- Unit tests (Karma/Jasmine)
```bash path=null start=null
npm test
```
- Run a single spec file
```bash path=null start=null
npx ng test --include src/app/<path-to-spec>.spec.ts
```
- Generate typed API client from OpenAPI spec
```bash path=null start=null
npm run api-gen
```

Backend (Spring Boot, in `book-social-network/book-netwok-api`)
- Start supporting services (MySQL, MailDev, Keycloak)
```bash path=null start=null
docker compose -f docker-compose.yml up -d
```
- Run the app with dev profile (port 8088, context path /api/v1/)
```bash path=null start=null
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
- Build JAR
```bash path=null start=null
mvn clean package -DskipTests
```
- Run tests
```bash path=null start=null
mvn test
```
- Run a single test (class or method)
```bash path=null start=null
mvn -Dtest=ClassName test
mvn -Dtest=ClassName#methodName test
```

Dockerized builds
- Backend image (uses `docker/backend/Dockerfile`; build context must be the backend project root)
```bash path=null start=null
docker build -f docker/backend/Dockerfile -t book-backend:local book-social-network/book-netwok-api
# run (maps 8088)
docker run --rm -p 8088:8088 -e ACTIVE_PROFILE=dev book-backend:local
```
- Frontend image (uses `docker/frontend/Dockerfile`; build context must be the Angular app root)
```bash path=null start=null
docker build -f docker/frontend/Dockerfile -t book-frontend:local frontEnd/Book-network-ui
# run (maps 80)
docker run --rm -p 8080:80 book-frontend:local
```

Notes on linting
- No lint scripts or configs are present for the Angular app or the Java project in this repo.

High-level architecture
Backend (Spring Boot 3.3, Java 17)
- Layers: REST controllers (e.g., `auth/AuthenticationController`, `book/BookController`) → services (`auth/AuthenticationService`, `book/BookService`) → repositories (Spring Data JPA: `book/BookRepository`, `user/UserRepository`, etc.). DTOs and mappers convert between entities and API shapes (e.g., `book/BookRequest/Response`, `book/BookMapper`).
- Persistence: MySQL via JPA/Hibernate; base auditing via `common/BaseEntity` and `config/ApplicationAuditAware`.
- Security: Resource server with Keycloak (`application-dev.yml` issuer URI); custom JWT utilities and filters (`security/JwtService`, `security/JwtFilter`, `security/KeycloakJwtAuthenticationConverter`, `security/SecurityConfig`).
- Features/domains: books (search via `BookSpecification`), feedback, history of transactions, file storage (`file/FileStorageService`), email templating (`resources/templates/*`). Global exception handling in `handler/GlobalExceptionHandler` with structured error codes.
- API docs: SpringDoc OpenAPI configured in `config/OpenApiConfig`; base context path is `/api/v1/`.

Frontend (Angular 18)
- UI app in `frontEnd/Book-network-ui` with routing, forms, and SSR packages. Auth libs include `keycloak-js` and `@auth0/angular-jwt`.
- Strongly-typed API layer is generated from `src/openapi/openapi.json` using `ng-openapi-gen` (output to `src/app/services`).

Ports and local services
- Backend: 8088 (base path `/api/v1/`)
- Dev dependencies via compose (run from `book-social-network/book-netwok-api`):
  - MySQL exposed on host 3307 → container 3306 (container name `mysql-bsn`)
  - MailDev UI 1080, SMTP 1025 (container `mail-dev-bsn`)
  - Keycloak at http://localhost:9090 (container `keycloak-bsn`)
