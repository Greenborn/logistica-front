import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

import { ConfigProvider }      from './config/config';

import { Service } from '../models/service';

@Injectable({ providedIn: 'root' })
export class ServicesService {

  constructor(
  	public http:   HttpClient,
    public config: ConfigProvider
  ) {}

  ///////////////////////////////////////////
  /// GET ALL
  public ServiceGetAOK = new Subject();
  public ServiceGetAKO = new Subject();

  getAll(){
    let conf   = this.config.getConfigData();
    let action = 'servicesAction';

    this.http.get(conf['apiBaseUrl'] + conf[ action ], { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ServiceGetAOK.next(data); },
      err =>  {  this.ServiceGetAKO.next(err);  }
    );
  }

  ///////////////////////////////////////////
  /// GET
  public ServiceGetOK = new Subject();
  public ServiceGetKO = new Subject();

  get(id){
    let conf   = this.config.getConfigData();
    let action = 'servicesAction';

    this.http.get(conf['apiBaseUrl'] + conf[ action ] + '/' + id, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ServiceGetOK.next(data); },
      err =>  {  this.ServiceGetKO.next(err);  }
    );
  }

  ///////////////////////////////////////////
  /// POST
  public ServicePostOK = new Subject();
  public ServicePostKO = new Subject();

  post(model:Service){
    let conf   = this.config.getConfigData();
    let action = 'servicesAction';

    this.http.post(conf['apiBaseUrl'] + conf[ action ], model, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ServicePostOK.next(data); },
      err =>  {  this.ServicePostKO.next(err);  }
    );
  }

  ///////////////////////////////////////////
  /// PUT
  public ServicePutOK = new Subject();
  public ServicePutKO = new Subject();

  put(model:Service){
    let conf   = this.config.getConfigData();
    let action = 'servicesAction';

    this.http.put(conf['apiBaseUrl'] + conf[ action ] + '/' + model.id, model, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ServicePutOK.next(data); },
      err =>  {  this.ServicePutKO.next(err);  }
    );
  }

  //////////////////////////////////////////
  /// DELETE
  public ServiceDelOK = new Subject();
  public ServiceDelKO = new Subject();

  delete(id){
    let conf   = this.config.getConfigData();
    let action = 'servicesAction';

    this.http.delete(conf['apiBaseUrl'] + conf[ action ] + '/' + id, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ServiceDelOK.next(data); },
      err =>  {  this.ServiceDelKO.next(err);  }
    );
  }
}
