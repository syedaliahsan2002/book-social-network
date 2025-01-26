// import { Injectable } from "@angular/core";
// import { 
//   HttpRequest,
//   HttpResponse,
//   HttpEvent,
//   HttpInterceptor,
//   HttpHandler,
//   HttpHeaders
//  } from "@angular/common/http";
// import { Observable } from "rxjs";
// import { TokenService } from "../token/token.service";

// @Injectable()
// export class HttpTokenInterceptor implements HttpInterceptor {
//   constructor(
//     private tokenService: TokenService
//   ) {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     const token:string = this.tokenService.token;
//     if(token){
//       const authReq : HttpRequest<unknown> = request.clone({
//         headers: new HttpHeaders({
//           Authorization: 'Bearer ' + token
//         })
//       });
//       return next.handle(authReq);
//     }
//     return next.handle(request); // Passes the request to the next handler without modification
//   }
// }

// Updated HttpTokenInterceptor
import { Injectable } from "@angular/core";
import { 
  HttpRequest,
  HttpEvent,
  HttpInterceptor,
  HttpHandler
 } from "@angular/common/http";
import { Observable } from "rxjs";
import { TokenService } from "../token/token.service";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string = this.tokenService.token;

    // Clone request and set the Authorization header only if a token is available
    const authReq = token 
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

    return next.handle(authReq); // Forward the modified request to the next handler
  }
}

