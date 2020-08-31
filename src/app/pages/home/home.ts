import { Component, OnInit } from '@angular/core';
import { Subject }   from 'rxjs';
import { Router, ActivatedRoute }    from '@angular/router';

import { ConfigProvider }               from '../../services/config/config';
import { GeneralService }               from '../../services/general.service';
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
    public menuService:    SideMenuService
  ) { }

  ngOnInit() {
    this.initializeConfig();
  }

  public initializeConfig(): void {
    this.configProvider.loadConfig();
    this.configProvider.configLoaded.subscribe({  next: (v) => {
      // aca se carga el resto, ya teniendo la configuración cargada
      this.setMenuLinks();
    } });
  }

  ngOnDestroy(){

  }


  setMenuLinks(){
    this.menuService.addOption({ 'label':'Inicio',      'link':'/home', 'icon':'', 'class':'', 'permisions':[] });
    this.menuService.addOption({ 'label':'Envios',      'link':'/envios',      'icon':'', 'class':'', 'permisions':[] });
    this.menuService.addOption({ 'label':'Usuarios',    'link':'/usuarios',      'icon':'', 'class':'', 'permisions':[] });
    this.menuService.addOption({ 'label':'Sucursales',  'link':'/sucursales',      'icon':'', 'class':'', 'permisions':[] });
    this.menuService.addOption({ 'label':'Salir',       'link':'/',      'icon':'', 'class':'', 'permisions':[] });
    this.menuService.addOption({ 'label':'Vehiculos',   'link':'/vehiculos',      'icon':'', 'class':'', 'permisions':[] });
  }
}
