import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {
redirectToLogin() {
  this.router.navigate(['login']);
}
onCodeCompleted(token: string) {
// throw new Error('Method not implemented.');
  this.confirmAccount(token);
}
  confirmAccount(token: string) {
    // throw new Error('Method not implemented.');
    this.authService.confirm({
      token
    }).subscribe({
      next: () => {
        this.message = 'your account has been sucessfully activated. \n now you can proceed to login';
        this.submitted = true;
        this.isOkey = true;
      },
      error: () => {
        this.message = 'your token has been ecpired or invalid.';
        this.submitted = true;
        this.isOkey=false;
      }
    })
  }

  message:string='';
  isOkey: boolean= true;
  submitted:boolean=false;


  constructor(
    private router:Router,
    private authService: AuthenticationService
  ){}
}
