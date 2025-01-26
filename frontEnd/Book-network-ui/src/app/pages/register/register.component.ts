import { Component } from '@angular/core';
import { RegistrationRequest } from '../../services/models';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {


constructor(
  private router: Router,
  private authService: AuthenticationService
){
  
}

login() {
  this.router.navigate(['login']);
// throw new Error('Method not implemented.');
}
register() {
  this.errorMsg=[];
  this.authService.register({
    body: this.registerRequest
  }).subscribe({
    next: () =>{
      this.router.navigate(['activate-account']);
    },
    error: (err) => {
      this.errorMsg = err.error.validdationErrors;
    }
  })
// throw new Error('Method not implemented.');
}

  registerRequest: RegistrationRequest={email:'',lastname:'',firstname:'',password:''};
  errorMsg:Array<string> =[];
}
