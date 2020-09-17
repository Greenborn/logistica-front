import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

import { ConfigProvider }      from './config/config';
import { AuthService }         from './auth/auth.service';

import { Vehicle } from '../models/vehicle';

@Injectable({ providedIn: 'root' })
export class VehicleService {

  constructor(
  	public http:   HttpClient,
    public config: ConfigProvider,
    public authS:  AuthService
  ) {}

  ///////////////////////////////////////////
  /// GET ALL
  public VehicleGetAOK = new Subject();
  public VehicleGetAKO = new Subject();

  getAll(){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf   = this.config.getConfigData();
    let action = 'vehiclesAction';

    this.http.get(conf['apiBaseUrl'] + conf[ action ],
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.VehicleGetAOK.next(data); },
        err =>  {  this.VehicleGetAKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// GET
  public VehicleGetOK = new Subject();
  public VehicleGetKO = new Subject();

  get( id:number ){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf   = this.config.getConfigData();
    let action = 'vehiclesAction';

    this.http.get(conf['apiBaseUrl'] + conf[ action ] + '/' + id,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.VehicleGetOK.next(data); },
        err =>  {  this.VehicleGetKO.next(err);  }
      );
  }
}
