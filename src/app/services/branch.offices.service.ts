import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

import { ConfigProvider }      from './config/config';
import { AuthService }         from './auth/auth.service';

import { BranchOffice } from '../models/branch.office';

@Injectable({ providedIn: 'root' })
export class BranchOfficesService {

  constructor(
  	public http:   HttpClient,
    public config: ConfigProvider,
    public authS:  AuthService
  ) {}

  /////////////////////////////////////////////////
  /// RETORNA LISTADO EXCLUYENDO LA OFICINA ACTUAL
  filterEActualOffice( data:any ){
    let list:any         = [];
    let actualOffice:any = this.authS.getBranchOffice();

    for( let c=0; c < data.items.length; c++ ){
      if ( data.items[ c ].id !== actualOffice.id ){
        list.push( data.items[ c ] );
      }
    }

    data.items = list;
    return data;
  }

  ///////////////////////////////////////////
  /// GET ALL
  public BranchOfficeGetAOK = new Subject();
  public BranchOfficeGetAKO = new Subject();

  getAll(){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['branchOfficesAction'],
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.BranchOfficeGetAOK.next(data); },
        err =>  {  this.BranchOfficeGetAKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// GET
  public BranchOfficeGetOK = new Subject();
  public BranchOfficeGetKO = new Subject();

  get(id){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.get(conf['apiBaseUrl'] + conf['branchOfficesAction'] + '/' + id,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.BranchOfficeGetOK.next(data); },
        err =>  {  this.BranchOfficeGetKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// POST
  public BranchOfficePostOK = new Subject();
  public BranchOfficePostKO = new Subject();

  post(model:BranchOffice){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.post(conf['apiBaseUrl'] + conf['branchOfficesAction'], model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.BranchOfficePostOK.next(data); },
        err =>  {  this.BranchOfficePostKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// PUT
  public BranchOfficePutOK = new Subject();
  public BranchOfficePutKO = new Subject();

  put(model:BranchOffice){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.put(conf['apiBaseUrl'] + conf['branchOfficesAction'] + '/' + model.id, model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.BranchOfficePutOK.next(data); },
        err =>  {  this.BranchOfficePutKO.next(err);  }
      );
  }

  ///////////////////////////////////////////
  /// PUT EXPAND
  public BranchOfficePutEOK = new Subject();
  public BranchOfficePutEKO = new Subject();

  putExpand(model:BranchOffice, p){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.put(conf['apiBaseUrl'] + conf['branchOfficesAction'] + '?expand=' + p, model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.BranchOfficePutEOK.next(data); },
        err =>  {  this.BranchOfficePutEKO.next(err);  }
      );
  }

  //////////////////////////////////////////
  /// DELETE
  public BranchOfficeDelOK = new Subject();
  public BranchOfficeDelKO = new Subject();

  delete(id){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf = this.config.getConfigData();

    this.http.delete(conf['apiBaseUrl'] + conf['branchOfficesAction'] + '/' + id,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.BranchOfficeDelOK.next(data); },
        err =>  {  this.BranchOfficeDelKO.next(err);  }
      );
  }


}
