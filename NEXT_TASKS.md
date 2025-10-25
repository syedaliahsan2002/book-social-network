# Next tasks

Short-term
- Stabilize domains: move from Cloudflare Quick Tunnels to your real domain(s) with Traefik and Let’s Encrypt.
- Keycloak hardening: set admin password, set email sender, enable verifyEmail if desired, configure realm roles and client scopes.
- Docker healthchecks and restart policies, add Keycloak DB migrations (export/import) to bootstrap.
- CI: add a deploy job (build, push images, docker compose pull/up on the server).

Frontend
- Externalize API base and Keycloak config via environment files per environment.
- Add silent SSO/refresh token flow and 401 handling.
- Improve error toasts for 4xx/5xx.

Backend
- Add role-based method security where needed.
- Add integration tests and testcontainers for MySQL.
- Tighten CORS when domains are stable.

Infrastructure
- Switch to HTTPS with Traefik + real DNS; add ACME DNS challenge if needed.
- Observability: add logs/metrics (e.g., Prometheus, Grafana, Loki) and health endpoints.
