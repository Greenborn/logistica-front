import { Component, OnInit } from '@angular/core';
import { Subject }   from 'rxjs';
import { Router, ActivatedRoute }    from '@angular/router';

import { GeneralService }               from '../../../services/general.service';
import { AuthService }                  from '../../../services/auth/auth.service';
import { ShippingsService }             from '../../../services/shippings.service';

@Component({
  selector:    'page-envio-detail',
  templateUrl: 'envio.detail.html'
})
export class EnvioDetail {

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
  }

  ngOnDestroy(){

  }

}
