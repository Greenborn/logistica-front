import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

import { ConfigProvider }      from './config/config';

import { Shipping } from '../models/shipping';

@Injectable({ providedIn: 'root' })
export class ShippingsService {

  constructor(
  	public http:   HttpClient,
    public config: ConfigProvider
  ) {}

  ///////////////////////////////////////////
  /// GET ALL
  public ShippingGetAOK = new Subject();
  public ShippingGetAKO = new Subject();

  getAll(){
    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['shippingsAction'], { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ShippingGetAOK.next(data); },
      err =>  {  this.ShippingGetAKO.next(err);  }
    );
  }

  ///////////////////////////////////////////
  /// GET
  public ShippingGetOK = new Subject();
  public ShippingGetKO = new Subject();

  get(id){
    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['shippingsAction'] + '/' + id, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ShippingGetOK.next(data); },
      err =>  {  this.ShippingGetKO.next(err);  }
    );
  }

  ///////////////////////////////////////////
  /// POST
  public ShippingPostOK = new Subject();
  public ShippingPostKO = new Subject();

  post(model:Shipping){
    let conf = this.config.getConfigData();

    this.http.post(conf['apiBaseUrl'] + conf['shippingsAction'], model, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ShippingPostOK.next(data); },
      err =>  {  this.ShippingPostKO.next(err);  }
    );
  }

  ///////////////////////////////////////////
  /// PUT
  public ShippingPutOK = new Subject();
  public ShippingPutKO = new Subject();

  put(model:Shipping){
    let conf = this.config.getConfigData();

    this.http.put(conf['apiBaseUrl'] + conf['shippingsAction'] + '/' + model.id, model, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ShippingPutOK.next(data); },
      err =>  {  this.ShippingPutKO.next(err);  }
    );
  }

  ///////////////////////////////////////////
  /// PUT EXPAND
  public ShippingPutEOK = new Subject();
  public ShippingPutEKO = new Subject();

  putExpand(model:Shipping, p){
    let conf = this.config.getConfigData();

    this.http.put(conf['apiBaseUrl'] + conf['shippingsAction'] + '?expand=' + p, model, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ShippingPutEOK.next(data); },
      err =>  {  this.ShippingPutEKO.next(err);  }
    );
  }

  //////////////////////////////////////////
  /// DELETE
  public ShippingDelOK = new Subject();
  public ShippingDelKO = new Subject();

  delete(id){
    let conf = this.config.getConfigData();

    this.http.delete(conf['apiBaseUrl'] + conf['shippingsAction'] + '/' + id, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ShippingDelOK.next(data); },
      err =>  {  this.ShippingDelKO.next(err);  }
    );
  }


}
