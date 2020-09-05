import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject }    from 'rxjs';

import { Login }  from '../../models/login';

import { ConfigProvider } from '../config/config';
import { GeneralService } from '../general.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public  router: Router,
    public  http:   HttpClient,
    public  config: ConfigProvider,
    public  gral:   GeneralService
  ) {
  }

  private LogedIn:boolean = false;
  private Token:string    = '$2y$13$2/EF2ACv9kptY8XGXOC0QuDc2Do.UoCBikl9nxDHiaTlEj7d.1Sr.%'; //[Modificar] Solo usado en pruebas

  login( model ){
    this.gral.presentLoading();
    let conf = this.config.getConfigData();
    this.http.post(conf['apiBaseUrl'] + conf['loginAction'], model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
        data => {
          this.gral.dismissLoading();
          this.LogedIn = (data as any).status;
          if ( this.LogedIn ){
            this.Token   = (data as any).token;
            this.router.navigate(['/home']);
          } else {
            this.gral.newMensaje( 'Usuario o contraseña incorrecta.' );
          }
        },
        err =>  {
          this.gral.dismissLoading();
          this.LogedIn = false;
          this.Token   = '';
          this.gral.newMensaje( 'Ha ocurrido un error, por favor reintente más tarde.' );
        }
      );
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
