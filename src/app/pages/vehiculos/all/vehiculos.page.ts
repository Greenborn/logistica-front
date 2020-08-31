import { Component, OnInit } from '@angular/core';

import { GeneralService }  from '../../../services/general.service';
import { AuthService }     from '../../../services/auth/auth.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.page.html',
  styleUrls: ['./vehiculos.page.scss'],
})
export class VehiculosPage implements OnInit {

  constructor(
    public  gral:   GeneralService,
    private auth:   AuthService
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();
  }

}
