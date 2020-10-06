// [MODIFICAR] Se podrían simplificar las funciones para los verbos Get,Post,Put, etc ya que son todas iguales

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { Router }     from '@angular/router';

import { ConfigProvider }       from './config/config';
import { AuthService }          from './auth/auth.service';
import { FormateoService }      from './formateo.service';

import { Shipping }     from '../models/shipping';
import { ShippingType } from '../models/shipping.type';
import { ShippingItem } from '../models/shipping.item';

@Injectable({ providedIn: 'root' })
export class ShippingsService {

  constructor(
  	public http:          HttpClient,
    public config:        ConfigProvider,
    public authS:         AuthService,
    public router:        Router,
    private format:       FormateoService
  ) {}

  getStatusTypes(){
    return [
      { 'id': 1, 'description':'Nuevo' },
      { 'id': 2, 'description':'En camino' },
      { 'id': 3, 'description':'Llegó a sucursal' },
      { 'id': 4, 'description':'Entregado' }
    ];
  }

  getStatusColors(){
    return {
      '1':'rgb(255, 212, 212)',
      '2':'#FFFF43',
      '3':'#FF8A43',
      '4':'#87FF43'
    };
  }

  ///////////////////////////////////////////
  public services_l_loaded:boolean   = false;
  public shippings_l_loaded:boolean  = false;
  public distances_l_loaded:boolean  = false;
  public branch_of_l_loaded:boolean  = false;
  public identifyT_l_loaded:boolean  = false;
  public vehicle_l_loaded:boolean    = false;
  public creationParamsLoaded:boolean = false;
  public RoadmapParamsLoaded:boolean  = false;
  public servicesTypes:any;
  public shippingsTypes:any;
  public distancesList:any;
  public identifyTList:any;
  public branchOfficeList:any;
  public VehicleList:any;

  public action:string = '';
  public elementId:number;
  public elementEnableEdition:boolean;
  public textSubmitAction:string;

  goToEdit( id:number ){
    this.action               = 'edit';
    this.elementId            = id;
    this.textSubmitAction     = 'Editar';
    this.elementEnableEdition = false;
    this.router.navigate(['/envios/detalle']);
    this.get();
  }

  public createAction:boolean  = true;
  public oneElement            = new Shipping();
  public oneElementshippngItem = new ShippingItem();
  goToCreate(){
    this.setCreateParams();
    this.router.navigate(['/envios/nuevo']);
  }
  setCreateParams(){
    this.elementEnableEdition  = true;
    this.action                = 'create';
    this.textSubmitAction      = 'Guardar';
    this.oneElement            = new Shipping();
    this.oneElementshippngItem = new ShippingItem();
  }

  goToAll(){
    this.getAll('?expand=originBranchOffice,serviceType,destinationBranchOffice,vehicle');
    this.router.navigate(['/exito']);
  }

  ///////////////////////////////////////////
  /// GET ALL
  public ShippingGetAOK = new Subject();
  public ShippingGetAKO = new Subject();

  getAll( expand:string = '' ){
    if ( !this.authS.logedIn() ){
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
  public LastElement:any;
  public getExpand = '?expand=originBranchOffice,serviceType,destinationBranchOffice,shippingItems,shippingType,distance,remitos,vehicle';

  get(){
    if ( !this.authS.logedIn() ){
        return false;
    }

    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['shippingsAction'] + '/' + this.elementId + this.getExpand,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) }).subscribe(
        data => {
                  this.LastElement = data;
                  this.ShippingGetOK.next(data);
        },
        err =>  {  this.ShippingGetKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// POST
  public ShippingPostOK = new Subject();
  public ShippingPostKO = new Subject();

  public validationErrors;
  public responseLastPost:any;

  validateModel( model:Shipping ){
    if ( model.payment_at_origin ){
      model.payment_at_origin = 1;
    } else {
      model.payment_at_origin = 0;
    }

    model.price = Number( this.format.getFloat( model.price ) );

    if ( model.items.length <= 0 ){
      this.validationErrors = "Es necesario cargar al menos un item.";
      return false;
    }

    return true;
  }

  post(model:Shipping){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.post(conf['apiBaseUrl'] + conf['shippingsAction'], model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) }).subscribe(
        data => {
          this.responseLastPost = data;
          this.ShippingPostOK.next(data);
        },
        err =>  {  this.ShippingPostKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// PUT
  public ShippingPutOK = new Subject();
  public ShippingPutKO = new Subject();

  put(model:Shipping){
    if ( !this.authS.logedIn() ){
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
    if ( !this.authS.logedIn() ){
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
    if ( !this.authS.logedIn() ){
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
    if ( !this.authS.logedIn() ){
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
    if ( !this.authS.logedIn() ){
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
    if ( !this.authS.logedIn() ){
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
    if ( !this.authS.logedIn() ){
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
