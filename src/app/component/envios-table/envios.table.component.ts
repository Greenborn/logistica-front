import { Component, OnInit, Input } from '@angular/core';

import { GeneralService }     from '../../services/general.service';
import { FormateoService }    from '../../services/formateo.service';

@Component({
  selector: 'envios-table',
  templateUrl: './envios.table.component.html',
  styleUrls:  ['./envios.table.component.scss'],
})
export class EnviosTableComponent implements OnInit {

  @Input() config:any;

  private ShippingGetAOK;
  private ShippingGetAKO;

  public shippings;

  public actualPage:number = 1;
  public totalRegs:number;
  public pageCount:number;
  public pageLinks:any = [];

  public filtersCollapsed:boolean   = true;
  public resaltadoCollapsed:boolean = true;

  constructor(
    public gral:    GeneralService,
    public  format: FormateoService
  ) { }

  ngOnInit() {
    if ( !this.config.resaltadoEnabled ){
      this.config.resaltado[ 0 ].enabled = false;
    }

    this.ShippingGetAOK = this.config.provider.ShippingGetAOK.subscribe({  next: ( response : any ) => {
      this.shippings = response.items;

      for ( let c=0; c < this.shippings.length; c ++ ){
        this.shippings[ c ].receiver_identification_type = this.shippings[ c ].receiver_identification.identification_type.name;
        this.shippings[ c ].sender_identification_type   = this.shippings[ c ].sender_identification.identification_type.name;
        this.shippings[ c ].originBranchOffice      = this.shippings[ c ].originBranchOffice.name;
        this.shippings[ c ].destinationBranchOffice = this.shippings[ c ].destinationBranchOffice.name;
        this.shippings[ c ].status_id               = this.shippings[ c ].status.id;
        this.shippings[ c ].status                  = this.shippings[ c ].status.label;
        this.shippings[ c ].serviceType             = this.shippings[ c ].serviceType.description;
        this.shippings[ c ].sender_identification   = this.shippings[ c ].sender_identification.value;
        this.shippings[ c ].receiver_identification = this.shippings[ c ].receiver_identification.value;
        this.shippings[ c ].price                   = this.format.getLocaleMoneyF( this.shippings[ c ].price );
        this.shippings[ c ].date                    = this.format.getSDateFromTimeStamp( this.shippings[ c ].date );
        this.shippings[ c ].payment_at_origin       = this.format.getTextOfBoolean( this.shippings[ c ].payment_at_origin );
        if ( this.shippings[ c ].vehicle != null ){
          this.shippings[ c ].vehicle = this.shippings[ c ].vehicle.description;
        }
      }

      this.totalRegs = response._meta.totalCount;
      this.pageCount = response._meta.pageCount;

      this.pageLinks = [];
      for (let c=1; c <= (response._meta as any).pageCount; c ++){
          this.pageLinks.push( { 'page':c } );
      }
      this.gral.dismissLoading();
    } });

    this.ShippingGetAKO = this.config.provider.ShippingGetAKO.subscribe({  next: ( response : any) => {

    } });

    this.loadPage( this.actualPage );
  }

  showFilters(){
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  showResaltado(){
    this.resaltadoCollapsed = !this.resaltadoCollapsed;
  }

  getBackgrounColor( id_status ){
    if ( !this.config.resaltado[ 0 ].enabled ){
      return '#FFF';
    }
    return this.config.resaltado[ 0 ].colors[ id_status ];
  }

  applyFilter(){
    this.loadPage( this.actualPage );
  }

  loadPage( page ){
    if ( page < 1 ){
      page = 1;
    }

    if ( page > this.pageCount ){
      page = this.pageCount;
    }

    this.actualPage = page;

    this.config.provider.getAll('?expand=originBranchOffice,serviceType,destinationBranchOffice,vehicle&page=' + this.actualPage);
    this.gral.presentLoading();
  }

  create(){
    this.config.provider.goToCreate();
  }

  edit( id:number ){
    this.config.provider.goToEdit( id );
  }

  ngOnDestroy(){
    this.ShippingGetAOK.unsubscribe();
    this.ShippingGetAKO.unsubscribe();
  }

  filterOptionClick( i:number ){

    if ( !this.config.filterFieldOptions[ i ].enabled ){
      if ( this.config.EnabledFilterFieldOptions.findIndex( (element) => element == i ) == -1 ){
        this.config.EnabledFilterFieldOptions.push( i );
        this.config.EnabledFilterFieldOptions.sort();
      }
    } else {
      for ( let c=0; c < this.config.EnabledFilterFieldOptions.length; c ++){
        if ( this.config.EnabledFilterFieldOptions[ c ] == i ){
          this.config.EnabledFilterFieldOptions.splice( c, 1);
        }
      }
    }

  }

}
