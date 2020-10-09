import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

import { ConfigProvider }      from './config/config';
import { AuthService }         from './auth/auth.service';

import { RoadMap } from '../models/roadmap';

@Injectable({ providedIn: 'root' })
export class RoadmapService {

  constructor(
  	public http:   HttpClient,
    public config: ConfigProvider,
    public authS:  AuthService
  ) {}

  ///////////////////////////////////////////
  /// POST
  public RoadmapPostOK = new Subject();
  public RoadmapPostKO = new Subject();

  post( model:RoadMap ){
    if ( !this.authS.logedIn() ){
        return false;
    }
    let conf   = this.config.getConfigData();
    let action = 'roadMapAction';

    this.http.post(conf['apiBaseUrl'] + conf[ action ], model,
      { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'Authorization':'Bearer ' + this.authS.getToken() }) } ).subscribe(
        data => {  this.RoadmapPostOK.next(data); },
        err =>  {  this.RoadmapPostKO.next(err);  }
      );
  }

}
