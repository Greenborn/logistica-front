// [MODIFICAR] Se podrían simplificar las funciones para los verbos Get,Post,Put, etc ya que son todas iguales

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

import { ConfigProvider }       from './config/config';
import { ServicesService }      from './services.service';
import { DistancesService }     from './distances.service';
import { AuthService }          from './auth/auth.service';
import { BranchOfficesService } from './branch.offices.service';

import { Shipping }     from '../models/shipping';
import { ShippingType } from '../models/shipping.type';
import { ShippingItem } from '../models/shipping.item';

@Injectable({ providedIn: 'root' })
export class ShippingsService {

  constructor(
  	public http:          HttpClient,
    public config:        ConfigProvider,
    public serviceS:      ServicesService,
    public authS:         AuthService,
    public BranchOfficeS: BranchOfficesService,
    public distanceS:     DistancesService
  ) {}

  public servicesTypes:any;
  public shippingsTypes:any;
  public distancesList:any;
  public branchOfficeList:any;
  public inCreateShipping:Shipping;

  public loadParamsOK = new Subject();
  public loadParamsKO = new Subject();
  public creationParamsLoaded:boolean = false;
  private services_l_loaded:boolean   = false;
  private shippings_l_loaded:boolean  = false;
  private distances_l_loaded:boolean  = false;
  private branch_of_l_loaded:boolean  = false;
  public loadCreateNewParams(){
    let serviceSubsOk;
    let serviceSubsKo;
    let shippingsSubsOk;
    let shippingsSubsKo;
    let distancesSubOk;
    let distancesSubKo;
    let branchOfficesOk;
    let branchOfficesKo;

    distancesSubOk = this.distanceS.DistancesGetAOK.subscribe({  next: (r: any[]) => {
      this.distancesList      = r;
      this.distances_l_loaded = true;

      this.proveNotifyAParamsLoaded();

    } });

    distancesSubKo = this.distanceS.DistancesGetAKO.subscribe({  next: (r: any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.distances_l_loaded = false;
    } });

    ///////////////////////

    branchOfficesOk = this.BranchOfficeS.BranchOfficeGetAOK.subscribe({  next: (r: any[]) => {
      this.branchOfficeList   = r;
      this.branch_of_l_loaded = true;

      this.proveNotifyAParamsLoaded();

    } });

    branchOfficesKo = this.BranchOfficeS.BranchOfficeGetAKO.subscribe({  next: (r: any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.branch_of_l_loaded = false;
    } });

    /////////////////////

    serviceSubsOk = this.serviceS.ServiceGetAOK.subscribe({  next: (r: any[]) => {
      this.servicesTypes     = r;
      this.services_l_loaded = true;

      this.proveNotifyAParamsLoaded();

    } });

    serviceSubsKo = this.serviceS.ServiceGetAKO.subscribe({  next: (r: any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.services_l_loaded = false;
    } });

    //////////////////////

    shippingsSubsOk = this.ShippingTypeGetAOK.subscribe({  next: (r: any[]) => {
      this.shippingsTypes     = r;
      this.shippings_l_loaded = true;

      this.proveNotifyAParamsLoaded();
    } });

    shippingsSubsKo = this.ShippingTypeGetAKO.subscribe({  next: (r: any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.shippings_l_loaded = false;
    } });

    this.serviceS.getAll();
    this.BranchOfficeS.getAll();
    this.distanceS.getAll();
    this.getTypes();
  }

  private proveNotifyAParamsLoaded(){
    if ( this.services_l_loaded && this.shippings_l_loaded && this.distances_l_loaded && this.branch_of_l_loaded ){
      this.creationParamsLoaded = true;
      this.loadParamsOK.next( true );
    }
  }

  ///////////////////////////////////////////
  /// GET ALL
  public ShippingGetAOK = new Subject();
  public ShippingGetAKO = new Subject();

  getAll( expand:string = '' ){
    if ( !this.authS.logedIn ){
        return false;
    }

    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['shippingsAction'] + expand,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.ShippingGetAOK.next(data); },
        err =>  {  this.ShippingGetAKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// GET
  public ShippingGetOK = new Subject();
  public ShippingGetKO = new Subject();

  get(id){
    if ( !this.authS.logedIn ){
        return false;
    }

    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['shippingsAction'] + '/' + id,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) }).subscribe(
        data => {  this.ShippingGetOK.next(data); },
        err =>  {  this.ShippingGetKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// POST
  public ShippingPostOK = new Subject();
  public ShippingPostKO = new Subject();

  public validationErrors;

  validateModel( model:Shipping ){
    //agregar vlaidaciones

    return true;
  }

  post(model:Shipping){
    if ( !this.authS.logedIn ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.post(conf['apiBaseUrl'] + conf['shippingsAction'], model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) }).subscribe(
        data => {  this.ShippingPostOK.next(data); },
        err =>  {  this.ShippingPostKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// PUT
  public ShippingPutOK = new Subject();
  public ShippingPutKO = new Subject();

  put(model:Shipping){
    if ( !this.authS.logedIn ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.put(conf['apiBaseUrl'] + conf['shippingsAction'] + '/' + model.id, model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) }).subscribe(
        data => {  this.ShippingPutOK.next(data); },
        err =>  {  this.ShippingPutKO.next(err);  }
      );
  }

  //////////////////////////////////////////
  /// DELETE
  public ShippingDelOK = new Subject();
  public ShippingDelKO = new Subject();

  delete(id){
    if ( !this.authS.logedIn ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.delete(conf['apiBaseUrl'] + conf['shippingsAction'] + '/' + id,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) }).subscribe(
        data => {  this.ShippingDelOK.next(data); },
        err =>  {  this.ShippingDelKO.next(err);  }
      );
  }

  //////////////////////////////////////////
  /// Tipos de Envio - GET All
  public ShippingTypeGetAOK = new Subject();
  public ShippingTypeGetAKO = new Subject();

  getTypes(){
    if ( !this.authS.logedIn ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['shippingTypesAction'],
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) }).subscribe(
        data => {  this.ShippingTypeGetAOK.next(data); },
        err =>  {  this.ShippingTypeGetAKO.next(err);  }
      );
  }

  //////////////////////////////////////////
  /// Tipos de Envio - GET
  public ShippingTypeGetOK = new Subject();
  public ShippingTypeGetKO = new Subject();

  getType(id){
    if ( !this.authS.logedIn ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['shippingTypesAction'] + '/' + id,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) }).subscribe(
        data => {  this.ShippingTypeGetOK.next(data); },
        err =>  {  this.ShippingTypeGetKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// Tipos de Envio - POST
  public ShippingTypePostOK = new Subject();
  public ShippingTypePostKO = new Subject();

  postType(model:ShippingType){
    if ( !this.authS.logedIn ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.post(conf['apiBaseUrl'] + conf['shippingsAction'], model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) }).subscribe(
        data => {  this.ShippingPostOK.next(data); },
        err =>  {  this.ShippingPostKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// Tipos de Envio - PUT
  public ShippingTypePutOK = new Subject();
  public ShippingTypePutKO = new Subject();

  putType(model:ShippingType){
    if ( !this.authS.logedIn ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.put(conf['apiBaseUrl'] + conf['shippingsAction'] + '/' + model.id, model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) }).subscribe(
        data => {  this.ShippingPutOK.next(data); },
        err =>  {  this.ShippingPutKO.next(err);  }
      );
  }

  //////////////////////////////////////////
  /// Tipos de Envio - DELETE
  public ShippingTypeDelOK = new Subject();
  public ShippingTypeDelKO = new Subject();

  deleteType(id){
    if ( !this.authS.logedIn ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.delete(conf['apiBaseUrl'] + conf['shippingsAction'] + '/' + id,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) }).subscribe(
        data => {  this.ShippingDelOK.next(data); },
        err =>  {  this.ShippingDelKO.next(err);  }
      );
  }
}
