import { Component, OnInit } from '@angular/core';
import { Subject }   from 'rxjs';
import { Router, ActivatedRoute }    from '@angular/router';

import { GeneralService }   from '../../../services/general.service';
import { AuthService }      from '../../../services/auth/auth.service';

@Component({
  selector:    'success-page',
  templateUrl: 'success.html'
})
export class SuccessPage {

  constructor(
    public router:         Router,
    public gral:           GeneralService,
    public acRoute:        ActivatedRoute,
    public auth:           AuthService
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();
  }

  ngOnDestroy(){

  }

  next(){
    this.router.navigate(['/envios/remito']); //[MODIFICAR] Esto ser temporal, luego la direccion sera especificada en un servicio
  }

}
