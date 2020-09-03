// [MODIFICAR] Se podrían simplificar las funciones para los verbos Get,Post,Put, etc ya que son todas iguales

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

import { ConfigProvider }      from './config/config';
import { ServicesService }     from './services.service';

import { Shipping }     from '../models/shipping';
import { ShippingType } from '../models/shipping.type';

@Injectable({ providedIn: 'root' })
export class ShippingsService {

  constructor(
  	public http:     HttpClient,
    public config:   ConfigProvider,
    public serviceS: ServicesService
  ) {}

  public servicesTypes:any;
  public shippingsTypes:any;


  public loadParamsOK = new Subject();
  public loadParamsKO = new Subject();
  public creationParamsLoaded:boolean = false;
  private services_l_loaded:boolean   = false;
  private shippings_l_loaded:boolean  = false;
  public loadCreateNewParams(){
    let serviceSubsOk;
    let serviceSubsKo;
    let shippingsSubsOk;
    let shippingsSubsKo;

    serviceSubsOk = this.serviceS.ServiceGetAOK.subscribe({  next: (r: any[]) => {
      this.servicesTypes     = r;
      this.services_l_loaded = true;

      this.proveNotifyAParamsLoaded();
      console.log(r);

    } });

    serviceSubsKo = this.serviceS.ServiceGetAKO.subscribe({  next: (r: any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.services_l_loaded = false;
    } });

    shippingsSubsOk = this.ShippingTypeGetAOK.subscribe({  next: (r: any[]) => {
      this.shippingsTypes     = r;
      this.shippings_l_loaded = true;

      this.proveNotifyAParamsLoaded();
      console.log(r);
    } });

    shippingsSubsKo = this.ShippingTypeGetAKO.subscribe({  next: (r: any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.shippings_l_loaded = false;
    } });

    this.serviceS.getAll();
    this.getTypes();
  }

  private proveNotifyAParamsLoaded(){
    if ( this.services_l_loaded && this.shippings_l_loaded ){
      this.creationParamsLoaded = true;
      this.loadParamsOK.next( true );
    }
  }

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

  //////////////////////////////////////////
  /// Tipos de Envio - GET All
  public ShippingTypeGetAOK = new Subject();
  public ShippingTypeGetAKO = new Subject();

  getTypes(){
    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['shippingTypesAction'], { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ShippingTypeGetOK.next(data); },
      err =>  {  this.ShippingTypeGetKO.next(err);  }
    );
  }

  //////////////////////////////////////////
  /// Tipos de Envio - GET
  public ShippingTypeGetOK = new Subject();
  public ShippingTypeGetKO = new Subject();

  getType(id){
    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['shippingTypesAction'] + '/' + id, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ShippingTypeGetOK.next(data); },
      err =>  {  this.ShippingTypeGetKO.next(err);  }
    );
  }

  ///////////////////////////////////////////
  /// Tipos de Envio - POST
  public ShippingTypePostOK = new Subject();
  public ShippingTypePostKO = new Subject();

  postType(model:ShippingType){
    let conf = this.config.getConfigData();

    this.http.post(conf['apiBaseUrl'] + conf['shippingsAction'], model, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ShippingPostOK.next(data); },
      err =>  {  this.ShippingPostKO.next(err);  }
    );
  }

  ///////////////////////////////////////////
  /// Tipos de Envio - PUT
  public ShippingTypePutOK = new Subject();
  public ShippingTypePutKO = new Subject();

  putType(model:ShippingType){
    let conf = this.config.getConfigData();

    this.http.put(conf['apiBaseUrl'] + conf['shippingsAction'] + '/' + model.id, model, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ShippingPutOK.next(data); },
      err =>  {  this.ShippingPutKO.next(err);  }
    );
  }

  //////////////////////////////////////////
  /// Tipos de Envio - DELETE
  public ShippingTypeDelOK = new Subject();
  public ShippingTypeDelKO = new Subject();

  deleteType(id){
    let conf = this.config.getConfigData();

    this.http.delete(conf['apiBaseUrl'] + conf['shippingsAction'] + '/' + id, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
      data => {  this.ShippingDelOK.next(data); },
      err =>  {  this.ShippingDelKO.next(err);  }
    );
  }
}
