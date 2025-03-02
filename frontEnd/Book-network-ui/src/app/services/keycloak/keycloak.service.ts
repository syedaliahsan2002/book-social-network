// import { Injectable } from '@angular/core';
// import Keycloak from 'keycloak-js';
// @Injectable({
//   providedIn: 'root'
// })
// export class KeycloakService {
 
//   private _keycloak: Keycloak | undefined; 

//   get keycloak(){
//     if(!this._keycloak){
//       this._keycloak= new Keycloak({
//         url: 'http://localhost:9090',
//         realm : 'book-social-network',
//         clientId: 'bsn'
//       });
//     }
//     return this._keycloak;
//   }

//   constructor() { }

//   async init(){
//     console.log("initilizing keycloak");
//     console.log('Authenticating the User')
//     const authenticated = await this.keycloak?.init({
//       onLoad: 'login-required',

//     });
//     if(authenticated){
//       console.log('user authenticated');
//     }
//   }
// }
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Keycloak from 'keycloak-js';
import { UserProfile } from './user-profile';
import { read } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: Keycloak | undefined;
  private isBrowser: boolean;
  private _profile: UserProfile | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  get keycloak(): Keycloak {
    if (!this.isBrowser) {
      throw new Error("Keycloak cannot be initialized on the server.");
    }

    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9090',
        realm: 'book-social-network',
        clientId: 'bsn'
      });
    }
    return this._keycloak;
  }

  get profile(): UserProfile | undefined{
    return this._profile;

  }

  async init() {
    if (!this.isBrowser) {
      console.warn("Skipping Keycloak initialization on the server.");
      return;
    }

    console.log("Initializing Keycloak...");
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required'
      });

      if (authenticated) {
        console.log("User authenticated");
        this._profile = (await this.keycloak?.loadUserProfile()) as UserProfile;
        this._profile.token = this.keycloak?.token;
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error initializing Keycloak:", error);
    }
  }

  login(){
    return this.keycloak?.login();
  }
  logout(){
    return this.keycloak?.logout();
  }
  accountManagment(){
    return this.keycloak?.accountManagement();
  }
}
// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import Keycloak from 'keycloak-js';
// import { UserProfile } from './user-profile';

// @Injectable({
//   providedIn: 'root'
// })
// export class KeycloakService {
//   private _keycloak: Keycloak | undefined;
//   private isBrowser: boolean;
//   private _profile: UserProfile | undefined;

//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   get keycloak(): Keycloak {
//     if (!this.isBrowser) {
//       throw new Error("Keycloak cannot be initialized on the server.");
//     }

//     if (!this._keycloak) {
//       this._keycloak = new Keycloak({
//         url: 'http://localhost:9090',
//         realm: 'book-social-network',
//         clientId: 'bsn'
//       });
//     }
//     return this._keycloak;
//   }

//   get profile(): UserProfile | undefined {
//     return this._profile;
//   }

//   async init() {
//     if (!this.isBrowser) {
//       console.warn("Skipping Keycloak initialization on the server.");
//       return;
//     }

//     console.log("Initializing Keycloak...");
//     try {
//       const authenticated = await this.keycloak.init({
//         onLoad: 'login-required',
//         checkLoginIframe: false // Disable iframe check for SSR
//       });

//       if (authenticated) {
//         console.log("User authenticated");
//         this._profile = (await this.keycloak.loadUserProfile()) as UserProfile;
//         this._profile.token = this.keycloak.token;
//       } else {
//         console.warn("User is not authenticated");
//       }
//     } catch (error) {
//       console.error("Error initializing Keycloak:", error);
//     }
//   }

//   login() {
//     return this.keycloak?.login();
//   }

//   logout() {
//     return this.keycloak?.logout({
//       redirectUri: 'http://localhost:4200'
//     });
//   }

//   getToken(): string | undefined {
//     return this.keycloak?.token;
//   }

//   isAuthenticated(): boolean {
//     return this.keycloak?.authenticated || false;
//   }

//   isTokenExpired(): boolean {
//     return this.keycloak?.isTokenExpired() || false;
//   }
// }
