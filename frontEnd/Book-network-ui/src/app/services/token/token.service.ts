// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class TokenService {

//   set token(token: string){
//     localStorage.setItem('token',token);
//   }
//   get token(){
//    return localStorage.getItem('token') as string; 
//   }
// }
//TODO update the check the token expirey if expire generate new one

//working one
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class TokenService {

//   private isLocalStorageAvailable(): boolean {
//     return typeof localStorage !== 'undefined';
//   }

//   set token(token: string) {
//     if (this.isLocalStorageAvailable()) {
//       localStorage.setItem('token', token);
//     }
//   }

//   get token(): string {
//     if (this.isLocalStorageAvailable()) {
//       return localStorage.getItem('token') as string;
//     }
//     return '';
//   }
// }

// Updated TokenService
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  isTokenNotValid() {
    return !this.isTokenValid();
  }
  isTokenValid() {
    const token : string = this.token;
    if(!token){
      return false;
    }
    //decode the token
    const jwtHelper:JwtHelperService = new JwtHelperService();

    const isTokenExpired: boolean =jwtHelper.isTokenExpired(token);
    if(isTokenExpired){
      localStorage.clear();
      return false;
    }
    return true;
  }
  private readonly TOKEN_KEY = 'token';

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  set token(token: string) {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  get token(): string {
    return this.isLocalStorageAvailable() ? (localStorage.getItem(this.TOKEN_KEY) || '') : '';
  }
}

//TODO if jwt token expire redirect to loginpage and clear the local storage