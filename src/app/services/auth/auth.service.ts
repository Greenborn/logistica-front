import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Login }  from '../../models/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public  router: Router,
  ) { }

  private LogedIn:boolean = false;
  private Token:string    = '$2y$13$2/EF2ACv9kptY8XGXOC0QuDc2Do.UoCBikl9nxDHiaTlEj7d.1Sr.%'; //[Modificar] Solo usado en pruebas

  login(){
    this.LogedIn = true;
    this.router.navigate(['/home']);
  }

  toLoginIfNL(){

    if ( !this.LogedIn ){
      this.router.navigate(['/']);
    }

  }

  logedIn(){
    return this.LogedIn;
  }

  getToken(){
    return this.Token;
  }
}
