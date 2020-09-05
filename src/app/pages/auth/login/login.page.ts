import { Component, OnInit } from '@angular/core';

import { GeneralService }  from '../../../services/general.service';
import { AuthService }     from '../../../services/auth/auth.service';
import { ConfigProvider }  from '../../../services/config/config';

import { Login } from '../../../models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public login = new Login();

  constructor(
    public  gral:   GeneralService,
    private auth:   AuthService,
    public  config: ConfigProvider,
  ) { }

  ngOnInit() {
    this.initializeConfig();
  }

  public initializeConfig(): void {
    this.config.loadConfig();
    this.config.configLoaded.subscribe({  next: (v) => {
      // aca se carga el resto, ya teniendo la configuración cargada

    } });
  }

  next(){
    this.auth.login( this.login );
  }

}
