import { Injectable } from '@angular/core';
import { Router }     from '@angular/router';

import { ResultPageConfigModel } from './result.config.model';

@Injectable({
  providedIn: 'root'
})
export class ResultPageService {
  constructor(
    public  router: Router,
  ) { }

  private config:ResultPageConfigModel;

  getConfig(){
    return this.config;
  }

  goToResultPage( params:ResultPageConfigModel ){
    this.config  = params;
    this.router.navigate([ '/exito' ]);
  }
}
