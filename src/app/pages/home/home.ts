import { Component, OnInit } from '@angular/core';
import { Subject }   from 'rxjs';
import { Router, ActivatedRoute }    from '@angular/router';

import { ConfigProvider }               from '../../services/config/config';
import { GeneralService }               from '../../services/general.service';
import { AuthService }                  from '../../services/auth/auth.service';
import { SideMenuService }              from '../../component/side-menu/side-menu.service';

@Component({
  selector:    'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public router:         Router,
    public gral:           GeneralService,
    public configProvider: ConfigProvider,
    public acRoute:        ActivatedRoute,
    public auth:           AuthService,
    public menuService:    SideMenuService
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();
    this.setMenuLinks();
  }

  ngOnDestroy(){

  }


  setMenuLinks(){
    this.menuService.clearOptions();
    this.menuService.addOption({ 'label':'Envios',      'link':'/envios',      'icon':'', 'class':'', 'permisions':[] });
    //this.menuService.addOption({ 'label':'Usuarios',    'link':'/usuarios',      'icon':'', 'class':'', 'permisions':[] });
    //this.menuService.addOption({ 'label':'Sucursales',  'link':'/sucursales',      'icon':'', 'class':'', 'permisions':[] });
    this.menuService.addOption({ 'label':'Salir',       'link':'/',      'icon':'', 'class':'', 'permisions':[] });
    //this.menuService.addOption({ 'label':'Vehiculos',   'link':'/vehiculos',      'icon':'', 'class':'', 'permisions':[] });
  }
}
