import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute }    from '@angular/router';

import { GeneralService }   from '../../../services/general.service';
import { AuthService }      from '../../../services/auth/auth.service';
import { ShippingsService } from '../../../services/shippings.service';

import { ShippingItem } from '../../../models/shipping.item';
import { Shipping     } from '../../../models/shipping';

@Component({
  selector: 'app-envios-one',
  templateUrl: './one.envios.page.html',
  styleUrls: ['./one.envios.page.scss'],
})
export class OneEnviosPage implements OnInit {

  private loadParamsOK;
  private loadParamsKO;
  private ShippingPostOK;
  private ShippingPostKO;

  public shippngItem = new ShippingItem();
  public shipping    = new Shipping();

  constructor(
    public  gral:   GeneralService,
    private auth:   AuthService,
    public  mainS:  ShippingsService,
    public  router: Router,
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();

    this.gral.presentLoading();
    this.mainS.loadCreateNewParams();

    this.loadParamsKO = this.mainS.loadParamsOK.subscribe({  next: (r: any[]) => {
      this.gral.dismissLoading();
    } });

    this.ShippingPostOK = this.mainS.ShippingPostOK.subscribe({  next: (r: any[]) => {
      this.gral.dismissLoading();
      this.router.navigate(['/envios']);
    } });

    this.ShippingPostKO = this.mainS.ShippingPostKO.subscribe({  next: (r: any[]) => {
      this.gral.newMensaje( 'Ha ocurrido un error, reintente nuevamente.' );
      this.gral.dismissLoading();
    } });
  }

  ngOnDestroy(){
    this.loadParamsKO.unsubscribe();
    this.loadParamsOK.unsubscribe();
    this.ShippingPostOK.unsubscribe();
    this.ShippingPostKO.unsubscribe();
  }

  addItem(){
    this.shipping.items.push( { 'description': this.shippngItem.description } );
    this.shippngItem = new ShippingItem();
  }

  delItem(i){
    this.shipping.items.splice(i, 1);
  }

  next(){
    if ( this.mainS.validateModel( this.shipping ) ){
      this.mainS.post( this.shipping );
    } else {
      this.gral.newMensaje( this.mainS.validationErrors );
    }
  }

}
