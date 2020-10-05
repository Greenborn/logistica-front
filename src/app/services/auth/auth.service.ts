import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject }    from 'rxjs';

import { Login }  from '../../models/login';

import { ConfigProvider }  from '../config/config';
import { GeneralService }  from '../general.service';
import { SideMenuService } from '../../component/side-menu/side-menu.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public  router: Router,
    public  http:   HttpClient,
    public  config: ConfigProvider,
    public  menuService: SideMenuService,
    public  gral:   GeneralService
  ) {
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

            this.router.navigate(['/envios']);
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

  private menuLinksSeted:boolean = false;
  toLoginIfNL(){

    if ( !this.menuLinksSeted ) {
      this.menuLinksSeted = true;
      this.setMenuLinks();
    }

    if ( !this.logedIn() ){
      this.router.navigate(['/']);
    }
  }

  toLogOut(){
    localStorage.setItem( 'logedIn',  JSON.stringify( false ) );
    localStorage.setItem( 'token',    JSON.stringify( '' ) );
    this.router.navigate(['/']);
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
        { label:'Listado', icon:'', class:'', permisions:[], link: '/envios' },
        { label:'Nuevo', icon:'', class:'', permisions:[], link: '/envios/nuevo' },
        { label:'Hoja de Ruta', icon:'', class:'', permisions:[], link: '/envios/hojaruta' }
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
