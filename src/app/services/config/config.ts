import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

import { Config } from '../../models/config';

@Injectable({ providedIn: 'root' })
export class ConfigProvider {

  public config:Config = new Config();

  public configLoaded = new Subject();

  public urlConfig = 'assets/config/config.json';

  constructor(
  	public http: HttpClient
  ) {}

  public getConfigData(){
  	return this.config;
  }

  public loadConfig(){
    if (this.config.hasOwnProperty('loaded')){
      if (this.config.loaded) { return true; }
    }

  	this.getConfig().subscribe(data => {
      this.config = <Config> data;
      this.config.loaded = true;
      this.configLoaded.next(true);
    }
    , err =>{
      console.log('Error al obtener la configuración!');
      this.loadConfig();
    });
  }

  public getConfig(){
    return this.http.get(this.urlConfig+'?d='+new Date().getTime());
  }
}
