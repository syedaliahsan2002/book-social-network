# Book Social Network – Deployment and Ops Summary

This repository now runs a full stack with Angular frontend, Spring Boot backend, and Keycloak, locally and on the public internet.

Live URLs (current)
- Frontend (Cloudflare Tunnel): https://belief-honolulu-plasma-intelligence.trycloudflare.com
- API base: https://belief-honolulu-plasma-intelligence.trycloudflare.com/api/v1
- Keycloak: https://penguin-constitutes-responsible-writing.trycloudflare.com

Admin access
- Console: https://penguin-constitutes-responsible-writing.trycloudflare.com/admin
- Realm: master for admin login, then switch to book-social-network
- Admin user: admin / KEYCLOAK_ADMIN_PASSWORD from .env (you can reset via kcadm)

What was implemented
1) CI/CD
   - .github/workflows/ci.yml: build & test (Maven + Angular)
   - .github/workflows/docker-publish.yml: build & publish images to GHCR (optional)

2) Containers & Orchestration
   - docker/backend/Dockerfile (Spring Boot 3, Java 17)
   - docker/frontend/Dockerfile (Angular build + Nginx)
   - docker-compose.yml (local dev: MySQL, MailDev, Keycloak, API, Frontend)
   - docker-compose.prod.yml (Traefik removed for now due to sslip.io rate-limit; added Cloudflare Tunnels for public access)

3) Keycloak
   - Bootstrapped realm book-social-network
   - Created client book-network-ui with redirect URIs to frontend
   - Enabled self-registration; added Register entry point in the UI
   - Backend validation switched to internal JWKs + issuer override to match tunnel

4) Frontend
   - Nginx config to serve SPA and proxy /api/v1 to backend
   - Keycloak integration fixed (PKCE, iframe polling disabled, register/logout/account buttons)
   - API base set to /api/v1 for container proxying

5) Backend
   - OAuth2 Resource Server with Keycloak converter
   - CORS relaxed to support dynamic tunnel origins
   - Context path /api/v1, port 8088

Local development
- Frontend
  - cd frontEnd/Book-network-ui
  - npm ci
  - npm start (http://localhost:4200)
  - Unit tests: npm test
  - Build: npm run build
- Backend
  - cd book-social-network/book-netwok-api
  - docker compose -f docker-compose.yml up -d (MySQL, MailDev, Keycloak)
  - mvn spring-boot:run -Dspring-boot.run.profiles=dev (http://localhost:8088/api/v1)

Containers (one-box)
- Local: docker compose up -d
- Public (HTTP + tunnels): docker compose -f docker-compose.prod.yml up -d

Notes
- sslip.io HTTPS is disabled due to Let’s Encrypt rate limits; tunnels provide HTTPS.
- If tunnels rotate, update:
  - Frontend Keycloak URL in src/app/services/keycloak/keycloak.service.ts
  - Keycloak client redirect URIs
  - Backend issuer override in docker-compose.prod.yml (ISSUER_URI) if needed

Push to GitHub
If this repo isn’t already on GitHub:
- Create a new GitHub repo (empty) and run:
  git init
  git add -A
  git commit -m "Initial deployment + infra setup"
  git branch -M main
  git remote add origin https://github.com/<your-username>/<repo>.git
  git push -u origin main

Or provide your GitHub username and a Personal Access Token with repo scope and I can push for you.
