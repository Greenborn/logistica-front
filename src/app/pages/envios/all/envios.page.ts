import { Component, OnInit } from '@angular/core';

import { GeneralService }   from '../../../services/general.service';
import { AuthService }      from '../../../services/auth/auth.service';
import { ShippingsService } from '../../../services/shippings.service';

@Component({
  selector: 'app-envios',
  templateUrl: './envios.page.html',
  styleUrls: ['./envios.page.scss'],
})
export class EnviosPage implements OnInit {

  private loadParamsOK;
  private loadParamsKO;

  constructor(
    public  gral:   GeneralService,
    private auth:   AuthService,
    public  mainS:  ShippingsService
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();

    this.gral.presentLoading();
    this.mainS.loadCreateNewParams();

    this.loadParamsKO = this.mainS.loadParamsOK.subscribe({  next: (r: any[]) => {
      this.gral.dismissLoading();
    } });
  }

  ngOnDestroy(){
    this.loadParamsKO.unsubscribe();
    this.loadParamsOK.unsubscribe();
  }

}
