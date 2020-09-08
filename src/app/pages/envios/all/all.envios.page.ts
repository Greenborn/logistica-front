import { Component, OnInit } from '@angular/core';
import { Router }    from '@angular/router';

import { GeneralService }   from '../../../services/general.service';
import { FormateoService }  from '../../../services/formateo.service';
import { AuthService }      from '../../../services/auth/auth.service';
import { ShippingsService } from '../../../services/shippings.service';

import { Shipping } from '../../../models/shipping';

@Component({
  selector: 'app-envios-all',
  templateUrl: './all.envios.page.html',
  styleUrls: ['./all.envios.page.scss'],
})
export class AllEnviosPage implements OnInit {

  public shippings:any;
  public pageLinks:any = [];
  public actualPage:number = 1;
  public totalRegs:number;
  public pageCount:number;

  private ShippingGetAOK;
  private ShippingGetAKO;

  constructor(
    public  gral:   GeneralService,
    private auth:   AuthService,
    public  mainS:  ShippingsService,
    public  format: FormateoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.toLoginIfNL();

    this.ShippingGetAOK = this.mainS.ShippingGetAOK.subscribe({  next: (r: any) => {
      this.shippings = r.items;
      this.totalRegs = r._meta.totalCount;
      this.pageCount = r._meta.pageCount;

      for (let c=1; c <= (r._meta as any).pageCount; c ++){
          this.pageLinks.push( { 'page':c } );
      }
      this.gral.dismissLoading();
    } });

    this.ShippingGetAKO = this.mainS.ShippingGetAKO.subscribe({  next: (r: any) => {

    } });

    this.loadPage( this.actualPage );
  }

  ngOnDestroy(){
    this.ShippingGetAOK.unsubscribe();
    this.ShippingGetAKO.unsubscribe();
  }

  filters(){

  }

  loadPage( p ){
    if ( p < 1 ){
      p = 1;
    }

    if ( p > this.pageCount ){
      p = this.pageCount;
    }

    this.actualPage ++;

    this.mainS.getAll('?expand=originBranchOffice,serviceType,destinationBranchOffice');
    this.gral.presentLoading();
  }

  create(){
    this.router.navigate(['/envios/nuevo']);
  }

}
