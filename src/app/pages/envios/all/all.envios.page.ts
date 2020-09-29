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

  public filtersCollapsed:boolean   = true;
  public resaltadoCollapsed:boolean = true;
  public resaltado:any = [
    { 'field':'status', 'enabled':true, 'colors':[] }
  ];
  public filterFieldOptions:any   = [
    { 'code':'date', 'text':'Fecha', 'enabled':true },
    { 'code':'originBranchOffice', 'text':'Sucursal de Origen', 'enabled':true },
    { 'code':'destinationBranchOffice', 'text':'Sucursal de Destino', 'enabled':true },
    { 'code':'origin_full_name', 'text':'Nombre Origen', 'enabled':true },
    { 'code':'destination_full_name', 'text':'Nombre Destino', 'enabled':true },
    { 'code':'price', 'text':'Precio', 'enabled':true },
    { 'code':'status', 'text':'Estado', 'enabled':true },
    { 'code':'origin_address', 'text':'Dirección de Origen', 'enabled':false },
    { 'code':'destination_address', 'text':'Dirección de Destino', 'enabled':false },
    { 'code':'payment_at_origin', 'text':'Pagado en Origen', 'enabled':false },
    { 'code':'serviceType', 'text':'Tipo de Servicio', 'enabled':false },
    { 'code':'sender_identification', 'text':'Identificación Remitente', 'enabled':false },
    { 'code':'receiver_identification', 'text':'Identificación Destinatario', 'enabled':false },
    { 'code':'receiver_identification_type', 'text':'Tipo de Identificación Destinatario', 'enabled':false },
    { 'code':'sender_identification_type', 'text':'Tipo de Identificación Remitente', 'enabled':false },
    { 'code':'vehicle', 'text':'Vehículo', 'enabled':false }
  ];
  public EnabledFilterFieldOptions:any = [ 0, 1, 2, 3, 4, 5, 6 ];

  private ShippingGetAOK;
  private ShippingGetAKO;

  constructor(
    public  gral:   GeneralService,
    private auth:   AuthService,
    public  mainS:  ShippingsService,
    public  format: FormateoService,
    private router: Router
  ) { }

  getBackgrounColor( id_status ){
    if ( !this.resaltado[ 0 ].enabled ){
      return '#FFF';
    }
    return this.resaltado[ 0 ].colors[ id_status ];
  }

  ngOnInit() {
    this.auth.toLoginIfNL();

    this.resaltado[ 0 ].colors = this.mainS.getStatusColors();

    this.ShippingGetAOK = this.mainS.ShippingGetAOK.subscribe({  next: ( response : any ) => {
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

    this.ShippingGetAKO = this.mainS.ShippingGetAKO.subscribe({  next: ( response : any) => {

    } });

    this.loadPage( this.actualPage );
  }

  edit( id:number ){
    this.mainS.goToEdit( id );
  }

  ngOnDestroy(){
    this.ShippingGetAOK.unsubscribe();
    this.ShippingGetAKO.unsubscribe();
  }

  applyFilter(){
    this.loadPage( this.actualPage );
  }

  filterOptionClick( i:number ){

    if ( !this.filterFieldOptions[ i ].enabled ){
      if ( this.EnabledFilterFieldOptions.findIndex( (element) => element == i ) == -1 ){
        this.EnabledFilterFieldOptions.push( i );
        this.EnabledFilterFieldOptions.sort();
      }
    } else {
      for ( let c=0; c < this.EnabledFilterFieldOptions.length; c ++){
        if ( this.EnabledFilterFieldOptions[ c ] == i ){
          this.EnabledFilterFieldOptions.splice( c, 1);
        }
      }
    }

  }

  showFilters(){
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  showResaltado(){
    this.resaltadoCollapsed = !this.resaltadoCollapsed;
  }

  loadPage( page ){
    if ( page < 1 ){
      page = 1;
    }

    if ( page > this.pageCount ){
      page = this.pageCount;
    }

    this.actualPage = page;

    this.mainS.getAll('?expand=originBranchOffice,serviceType,destinationBranchOffice,vehicle&page=' + this.actualPage);
    this.gral.presentLoading();
  }

  create(){
    this.mainS.goToCreate();
  }

}
