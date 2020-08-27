import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public  router: Router,
  ) { }

  private LogedIn:boolean = false;

  login(){
    this.LogedIn = true;
    this.router.navigate(['/home']);
  }

  toLoginIfNL(){

    if ( !this.LogedIn ){
      this.router.navigate(['/']);
    }

  }
}
