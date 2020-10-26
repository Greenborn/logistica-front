import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject }    from 'rxjs';

import { Login }  from '../../models/login';

import { ConfigProvider }   from '../config/config';
import { GeneralService }   from '../general.service';
import { ShippingsService } from '../shippings.service';
import { RoadmapService }   from '../roadmap.service';
import { SideMenuService }  from '../../component/side-menu/side-menu.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private  router:      Router,
    private  http:        HttpClient,
    private  config:      ConfigProvider,
    private  menuService: SideMenuService,
    private  shippingS:   ShippingsService,
    private  roadmapS:    RoadmapService,
    private  gral:        GeneralService
  ) {
    //seteo de provider de autenticación para evitar dependencia circular
    this.shippingS.authS = this;
    this.roadmapS.authS  = this;
  }

  login( model ){
    this.gral.presentLoading();
    let conf = this.config.getConfigData();
    this.http.post(conf['apiBaseUrl'] + conf['loginAction'], model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) }).subscribe(
        data => {
          this.gral.dismissLoading();

          if ( (data as any).status ){
            localStorage.setItem( 'token',        JSON.stringify( (data as any).token ) );
            localStorage.setItem( 'branchOffice', JSON.stringify( (data as any).branchOffice ) );
            localStorage.setItem( 'logedIn',      JSON.stringify( (data as any).status ) );

            this.shippingS.goToAll();
          } else {
            this.gral.newMensaje( 'Usuario o contraseña incorrecta.' );
          }
        },
        err =>  {
          this.gral.dismissLoading();
          localStorage.setItem( 'logedIn',  JSON.stringify( false ) );
          localStorage.setItem( 'token',    JSON.stringify( '' ) );
          this.gral.newMensaje( 'Ha ocurrido un error, por favor reintente más tarde.' );
        }
      );
  }

  toLoginIfNL(){

    if ( !this.logedIn() ){
      this.router.navigate(['/login']);
    } else {
      this.setMenuLinks();
    }
  }

  toLogOut(){
    localStorage.setItem( 'logedIn',  JSON.stringify( false ) );
    localStorage.setItem( 'token',    JSON.stringify( '' ) );
    this.router.navigate(['/login']);
  }

  logedIn(){
    return JSON.parse( localStorage.getItem( 'logedIn' ) );
  }

  getToken(){
    return JSON.parse( localStorage.getItem( 'token' ) );
  }

  getBranchOffice(){
    return JSON.parse( localStorage.getItem( 'branchOffice' ) );
  }

  setMenuLinks(){
    this.menuService.clearOptions();
    this.menuService.addOption({ label:'Envios', icon:'', class:'', permisions:[], collapsed:false,
      subOptions:[
        { label:'Listado', icon:'', class:'', permisions:[],
            onClick: () => { this.shippingS.goToAll(); } },
        { label:'Nuevo', icon:'', class:'',   permisions:[],
            onClick: () => { this.shippingS.goToCreate(); } },
        { label:'Hoja de Ruta', icon:'', class:'', permisions:[],
            onClick: () => { this.roadmapS.goToRoadMapP(); }  }
      ],
    });
    //this.menuService.addOption({ 'label':'Usuarios',    'link':'/usuarios',      'icon':'', 'class':'', 'permisions':[] });
    //this.menuService.addOption({ 'label':'Sucursales',  'link':'/sucursales',      'icon':'', 'class':'', 'permisions':[] });
    this.menuService.addOption({
      onClick: () => { this.toLogOut(); }, collapsed:false,
      label:'Salir', icon:'', class:'', permisions:[], subOptions:[]
    });
    //this.menuService.addOption({ 'label':'Vehiculos',   'link':'/vehiculos',      'icon':'', 'class':'', 'permisions':[] });
  }
}
