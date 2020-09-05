import { Component, OnInit } from '@angular/core';
import { Router }    from '@angular/router';

import { GeneralService }   from '../../../services/general.service';
import { AuthService }      from '../../../services/auth/auth.service';
import { ShippingsService } from '../../../services/shippings.service';

import { Shipping } from '../../../models/shipping';

@Component({
  selector: 'app-envios-all',
  templateUrl: './all.envios.page.html',
  styleUrls: ['./all.envios.page.scss'],
})
export class AllEnviosPage implements OnInit {

  public shippings:any;
  private ShippingGetAOK;
  private ShippingGetAKO;

  constructor(
    public  gral:   GeneralService,
    private auth:   AuthService,
    public  mainS:  ShippingsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();

    this.ShippingGetAOK = this.mainS.ShippingGetAOK.subscribe({  next: (r: any) => {
      this.shippings = r.items;
      this.gral.dismissLoading();
    } });

    this.ShippingGetAKO = this.mainS.ShippingGetAKO.subscribe({  next: (r: any) => {

    } });

    this.mainS.getAll('?expand=originBranchOffice,serviceType,destinationBranchOffice');
    this.gral.presentLoading();
  }

  ngOnDestroy(){
    this.ShippingGetAOK.unsubscribe();
    this.ShippingGetAKO.unsubscribe();
  }

  filters(){

  }

  create(){
    this.router.navigate(['/envios/nuevo']);
  }

}
