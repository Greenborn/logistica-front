import { Component, OnInit } from '@angular/core';
import { Subject }   from 'rxjs';
import { Router, ActivatedRoute }    from '@angular/router';

import { GeneralService }               from '../../../services/general.service';
import { AuthService }                  from '../../../services/auth/auth.service';
import { SideMenuService }              from '../../../component/side-menu/side-menu.service';
import { ShippingsService }             from '../../../services/shippings.service';

@Component({
  selector:    'page-envio-delivery-note',
  templateUrl: 'envio.delivery.note.html'
})
export class EnvioDeliveryNote {

  public deliveryNotes:any;

  constructor(
    public router:         Router,
    public gral:           GeneralService,
    public acRoute:        ActivatedRoute,
    public mainS:          ShippingsService,
    public auth:           AuthService
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();

    this.deliveryNotes = this.mainS.responseLastPost._links.remito;
  }

  next(){
    this.router.navigate(['/envios']);
  }

  ngOnDestroy(){

  }

  download( index ){

  }

}
