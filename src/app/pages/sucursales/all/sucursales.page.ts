import { Component, OnInit } from '@angular/core';

import { GeneralService }  from '../../../services/general.service';
import { AuthService }     from '../../../services/auth/auth.service';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.page.html',
  styleUrls: ['./sucursales.page.scss'],
})
export class SucursalesPage implements OnInit {

  constructor(
    public  gral:   GeneralService,
    private auth:   AuthService
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();
  }

}
