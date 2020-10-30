import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { Router }     from '@angular/router';

import { ConfigProvider }      from './config/config';

import { RoadMap } from '../models/roadmap';

@Injectable({ providedIn: 'root' })
export class RoadmapService {

  public authS;

  constructor(
  	public http:   HttpClient,
    public config: ConfigProvider,
    public router: Router,
  ) {}

  ///////////////////////////////////////////
  public reloadRoadMapV = new Subject();
  goToRoadMapP(){
    this.router.navigate([ '/envios/hojaruta' ]);
    this.reloadRoadMapV.next( true );
  }

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
