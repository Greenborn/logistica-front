import { Component, OnInit } from '@angular/core';
import { Subject }   from 'rxjs';
import { Router, ActivatedRoute }    from '@angular/router';

import { ConfigProvider }               from '../../services/config/config';
import { GeneralService }               from '../../services/general.service';
import { AuthService }                  from '../../services/auth/auth.service';

@Component({
  selector:    'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public router:         Router,
    public gral:           GeneralService,
    public configProvider: ConfigProvider,
    public acRoute:        ActivatedRoute,
    public auth:           AuthService
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();
  }

  ngOnDestroy(){

  }

}
