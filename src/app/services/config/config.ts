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
    if ( this.config.loaded ){
      return this.config;
    }

    if ( localStorage.getItem( 'config' ) != null ){
      this.config = JSON.parse( localStorage.getItem( 'config' ) );
      return this.config;
    }

    this.getConfig().subscribe(data => {
      this.config        = <Config> data;
      this.config.loaded = true;
      localStorage.setItem( 'config', JSON.stringify( this.config ) );
      return this.config;
    }, err =>{
      console.log('Error al obtener la configuración!');
      return null;
    });
  }

  public getConfig(){
    return this.http.get(this.urlConfig+'?d='+new Date().getTime());
  }
}
