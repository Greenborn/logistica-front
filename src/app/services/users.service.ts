import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

import { ConfigProvider }      from './config/config';
import { AuthService }         from './auth/auth.service';

@Injectable({ providedIn: 'root' })
export class UsersService {

  constructor(
  	public http:   HttpClient,
    public config: ConfigProvider,
    public authS:  AuthService
  ) {}

  ///////////////////////////////////////////
  /// GET ALL
  public UsersGetAOK = new Subject();
  public UsersGetAKO = new Subject();
  public LastElements:any = [];

  getAll(){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf   = this.config.getConfigData();
    let action = 'usersAction';

    this.http.get(conf['apiBaseUrl'] + conf[ action ],
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {
          this.LastElements = data;
          this.UsersGetAOK.next(data);
        },
        err =>  {  this.UsersGetAKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// GET
  public UsersGetOK = new Subject();
  public UsersGetKO = new Subject();

  get( id:number ){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf   = this.config.getConfigData();
    let action = 'usersAction';

    this.http.get(conf['apiBaseUrl'] + conf[ action ] + '/' + id,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.UsersGetOK.next(data); },
        err =>  {  this.UsersGetKO.next(err);  }
      );
  }
}
