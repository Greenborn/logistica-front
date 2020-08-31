import { Component, OnInit } from '@angular/core';

import { GeneralService }  from '../../../services/general.service';
import { AuthService }     from '../../../services/auth/auth.service';

@Component({
  selector: 'app-envios',
  templateUrl: './envios.page.html',
  styleUrls: ['./envios.page.scss'],
})
export class EnviosPage implements OnInit {

  constructor(
    public  gral:   GeneralService,
    private auth:   AuthService
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();
  }

}
