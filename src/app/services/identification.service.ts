import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

import { ConfigProvider }      from './config/config';
import { AuthService }         from './auth/auth.service';

@Injectable({ providedIn: 'root' })
export class IdentificationService {

  constructor(
  	public http:   HttpClient,
    public config: ConfigProvider,
    public authS:  AuthService
  ) {}

  ///////////////////////////////////////////
  /// GET ALL
  public IdentificationTypeGetAOK = new Subject();
  public IdentificationTypeGetAKO = new Subject();

  getAll(){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf   = this.config.getConfigData();
    let action = 'servicesIdentificationType';

    this.http.get(conf['apiBaseUrl'] + conf[ action ],
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.IdentificationTypeGetAOK.next(data); },
        err =>  {  this.IdentificationTypeGetAKO.next(err);  }
      );
  }

}
