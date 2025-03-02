import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../token/token.service';
import { KeycloakService } from '../keycloak/keycloak.service';

export const authGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  if(keycloakService.keycloak.isTokenExpired()){
    router.navigate(['login']);
    return false;
  }
  return true;
};
// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { KeycloakService } from '../keycloak/keycloak.service';

// export const authGuard: CanActivateFn = () => {
//   const keycloakService = inject(KeycloakService);
//   const router = inject(Router);

//   if (!keycloakService.isAuthenticated()) {
//     console.warn("User is not authenticated, redirecting to login.");
//     router.navigate(['login']);
//     return false;
//   }

//   if (keycloakService.isTokenExpired()) {
//     console.warn("Token expired, redirecting to login.");
//     router.navigate(['login']);
//     return false;
//   }

//   return true;
// };
