import { Component, OnInit } from '@angular/core';
import { Subject }   from 'rxjs';
import { Router, ActivatedRoute }    from '@angular/router';

import { GeneralService }               from '../../../services/general.service';
import { AuthService }                  from '../../../services/auth/auth.service';
import { ShippingsService }             from '../../../services/shippings.service';

@Component({
  selector:    'page-envio-delivery-note',
  templateUrl: 'envio.delivery.note.html'
})
export class EnvioDeliveryNote {

  public deliveryNotes:any = { 'original':'', 'remito_duplicado':'', 'remito_triplicado':'', 'remito_cuadruplicado':'' };

  constructor(
    public router:         Router,
    public gral:           GeneralService,
    public acRoute:        ActivatedRoute,
    public mainS:          ShippingsService,
    public auth:           AuthService
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();

    if( this.mainS.action == 'create' ){
      this.deliveryNotes = this.mainS.responseLastPost._links.remito;
    } else {
      this.deliveryNotes.original             = this.mainS.LastElement.remitos.original   + '&token=' + this.auth.getToken();
      this.deliveryNotes.remito_duplicado     = this.mainS.LastElement.remitos.doubled    + '&token=' + this.auth.getToken();
      this.deliveryNotes.remito_triplicado    = this.mainS.LastElement.remitos.tripled    + '&token=' + this.auth.getToken();
      this.deliveryNotes.remito_cuadruplicado = this.mainS.LastElement.remitos.cuadrupled + '&token=' + this.auth.getToken();

    }

  }

  next(){
    this.router.navigate(['/envios']);
  }

  ngOnDestroy(){

  }

  download( index ){

  }

}
