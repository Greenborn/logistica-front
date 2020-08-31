import { Component, OnInit } from '@angular/core';

import { GeneralService }  from '../../../services/general.service';
import { AuthService }     from '../../../services/auth/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  constructor(
    public  gral:   GeneralService,
    private auth:   AuthService
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();
  }

}
