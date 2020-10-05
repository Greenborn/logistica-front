import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit() {
    if ( this.auth.logedIn() ){
      this.router.navigate(['/home']);
    }
  }

  next(){
    this.auth.login( this.login );
  }

}
