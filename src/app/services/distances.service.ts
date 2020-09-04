import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

import { ConfigProvider }      from './config/config';
import { AuthService }         from './auth/auth.service';

import { Distance } from '../models/distance';

@Injectable({ providedIn: 'root' })
export class DistancesService {

  constructor(
  	public http:   HttpClient,
    public config: ConfigProvider,
    public authS:  AuthService
  ) {}

  ///////////////////////////////////////////
  /// GET ALL
  public DistancesGetAOK = new Subject();
  public DistancesGetAKO = new Subject();

  getAll(){
    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['distancesAction'],
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.DistancesGetAOK.next(data); },
        err =>  {  this.DistancesGetAKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// GET
  public DistancesGetOK = new Subject();
  public DistancesGetKO = new Subject();

  get(id){
    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['distancesAction'] + '/' + id,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.DistancesGetOK.next(data); },
        err =>  {  this.DistancesGetKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// POST
  public DistancesPostOK = new Subject();
  public DistancesPostKO = new Subject();

  post(model:Distance){
    let conf = this.config.getConfigData();

    this.http.post(conf['apiBaseUrl'] + conf['distancesAction'], model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.DistancesPostOK.next(data); },
        err =>  {  this.DistancesPostKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// PUT
  public DistancesPutOK = new Subject();
  public DistancesPutKO = new Subject();

  put(model:Distance){
    let conf = this.config.getConfigData();

    this.http.put(conf['apiBaseUrl'] + conf['distancesAction'] + '/' + model.id, model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.DistancesPutOK.next(data); },
        err =>  {  this.DistancesPutKO.next(err);  }
      );
  }

  //////////////////////////////////////////
  /// DELETE
  public DistancesDelOK = new Subject();
  public DistancesDelKO = new Subject();

  delete(id){
    let conf = this.config.getConfigData();

    this.http.delete(conf['apiBaseUrl'] + conf['distancesAction'] + '/' + id,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.DistancesDelOK.next(data); },
        err =>  {  this.DistancesDelKO.next(err);  }
      );
  }


}
