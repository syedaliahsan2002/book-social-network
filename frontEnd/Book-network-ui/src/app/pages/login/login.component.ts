import { Component, OnInit } from '@angular/core';
import { AuthenticationRequest } from '../../services/models';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { TokenService } from '../../services/token/token.service';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Corrected styleUrls
})
export class LoginComponent implements OnInit {
  //authRequest: AuthenticationRequest = { email: '', password: '' };
  //errorMsg: Array<string> = [];

  constructor(
    // private router: Router,
    // private authService: AuthenticationService,
    // private tokenService: TokenService
    //another service (if you need another service, add it here)
    private keycloakService: KeycloakService
  ) {}
  async ngOnInit(): Promise<void> {
    // Auth is handled at app bootstrap via APP_INITIALIZER
  }

  // register() {
  //   this.router.navigate(['register']);
  //   // Removed throw new Error, no need for this here
  // }

  // login() {
  //   this.errorMsg = [];
  //   this.authService.authenticate({ body: this.authRequest }).subscribe({
  //     next: (res) => {
  //       this.tokenService.token = res.token as string;
  //       this.router.navigate(['books']);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       // this.errorMsg.push('Login failed. Please check your credentials.');
  //       if(err.error.validdationErrors){
  //         this.errorMsg = err.error.validdationErrors
  //       }else{
  //         this.errorMsg.push(err.error.error);
  //       }
  //     }
  //   });
  //   // Removed throw new Error here as well
  // }
}
