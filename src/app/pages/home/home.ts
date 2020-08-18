import { Component, OnInit } from '@angular/core';
import { Subject }   from 'rxjs';
import { Router, ActivatedRoute }    from '@angular/router';

import { ConfigProvider }               from '../../services/config/config';
import { GeneralService }               from '../../services/general.service';

declare const fbq: any;

@Component({
  selector:    'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public router:         Router,
    public gral:           GeneralService,
    public configProvider: ConfigProvider,
    public acRoute:        ActivatedRoute
  ) { }

  ngOnInit() {
    this.initializeConfig();
  }

  public initializeConfig(): void {
    this.configProvider.loadConfig();
    this.configProvider.configLoaded.subscribe({  next: (v) => {
    // aca se carga el resto, ya teniendo la configuración cargada
    } });
  }

  ngOnDestroy(){
  
  }

}
