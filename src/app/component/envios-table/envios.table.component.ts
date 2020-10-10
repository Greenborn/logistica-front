import { Component, OnInit, Input } from '@angular/core';
import { Subject }                          from 'rxjs';

import { GeneralService }     from '../../services/general.service';
import { FormateoService }    from '../../services/formateo.service';
import { AuthService }        from '../../services/auth/auth.service';

import { OutputTableModel } from './output.table.model';

@Component({
  selector: 'envios-table',
  templateUrl: './envios.table.component.html',
  styleUrls:  ['./envios.table.component.scss'],
})
export class EnviosTableComponent implements OnInit {

  @Input() config:any;
  @Input() output:OutputTableModel;

  private ShippingGetAOK;
  private ShippingGetAKO;
  private updateTableSubject;

  public shippings;

  public actualPage:number = 1;
  public totalRegs:number;
  public pageCount:number;
  public pageLinks:any = [];

  public filtersCollapsed:boolean   = true;
  public resaltadoCollapsed:boolean = true;

  public  checkBoxArray:any        = [];
  private regData:any              = [];
  public  checkAllReg:boolean      = true;
  private checkBoxSelected:any     = [];
  private fieldsSelected:any       = [];
  public  componentEnabled:boolean = true;

  constructor(
    public gral:    GeneralService,
    public  format: FormateoService,
    public auth:    AuthService
  ) { }

  ngOnInit() {
    if ( this.config == undefined ){
      this.componentEnabled = false;
    }

    if ( this.config.updateTableSubject != undefined ){
      this.updateTableSubject = this.config.updateTableSubject.subscribe({  next: ( params : any) => {
        if ( this.auth.logedIn() ){
          this.shippings        = [];
          this.checkBoxArray    = [];
          this.checkAllReg      = true;
          this.loadPage( this.actualPage );
        }
      } });
    }

    if ( !this.config.resaltadoEnabled ){
      this.config.resaltado[ 0 ].enabled = false;
    }

    this.ShippingGetAOK = this.config.provider.ShippingGetAOK.subscribe({  next: ( response : any ) => {
      this.shippings = [];

      for ( let c=0; c < response.items.length; c ++ ){
        this.shippings.push( {
          receiver_identification_type: response.items[ c ].receiver_identification.identification_type.name,
          sender_identification_type:   response.items[ c ].sender_identification.identification_type.name,
          originBranchOffice:           response.items[ c ].originBranchOffice.name,
          destinationBranchOffice:      response.items[ c ].destinationBranchOffice.name,
          status_id:                    response.items[ c ].status.id,
          status:                       response.items[ c ].status.label,
          serviceType:                  response.items[ c ].serviceType.description,
          sender_identification:        response.items[ c ].sender_identification.value,
          receiver_identification:      response.items[ c ].receiver_identification.value,
          price:                        this.format.getLocaleMoneyF( response.items[ c ].price ),
          date:                         this.format.getSDateFromTimeStamp( response.items[ c ].date ),
          payment_at_origin:            this.format.getTextOfBoolean( response.items[ c ].payment_at_origin ),
          vehicle:                      '',
          origin_full_name:             response.items[ c ].origin_full_name,
          origin_contact:               response.items[ c ].origin_contact,
          destination_full_name:        response.items[ c ].destination_full_name,
          destination_contact:          response.items[ c ].destination_contact,
          origin_address:               response.items[ c ].origin_address,
          destination_address:          response.items[ c ].destination_address,
          id:                           response.items[ c ].id
        } );

        if ( response.items[ c ].vehicle != null ){
          this.shippings[ c ].vehicle = response.items[ c ].vehicle.description;
        }

        // si la clave ya existe no se sobreescribe su valor
        if ( !this.checkBoxArray.hasOwnProperty( String( response.items[ c ].id ) ) ){
          this.checkBoxArray[ String( response.items[ c ].id ) ] = true;
        }
      }

      this.totalRegs = response._meta.totalCount;
      this.pageCount = response._meta.pageCount;

      this.pageLinks = [];
      for (let c=1; c <= (response._meta as any).pageCount; c ++){
          this.pageLinks.push( { 'page':c } );
      }
      this.gral.dismissLoading();
      this.checkBoxRegChange();
    } });

    this.ShippingGetAKO = this.config.provider.ShippingGetAKO.subscribe({  next: ( response : any) => {

    } });

    if ( this.auth.logedIn() ){
      this.loadPage( this.actualPage );
    }
  }

  checkAllClick(){
    for ( let c = 0; c < this.shippings.length; c++ ){
      this.checkBoxArray[ this.shippings[ c ].id ] = this.checkAllReg;
    }

    this.checkBoxRegChange();
  }

  checkBoxRegChange(){
    this.checkBoxSelected = [];
    this.checkBoxArray.forEach( ( element, key ) => { //se hace un nuevo arreglo solo con los id de los reg seleccionados
      if ( element ){
        this.checkBoxSelected.push( key );
      }
    });

    //se recorren los envios para armar un nuevo arreglo con la información de los registros seleccionados para ser usado en el .pdf de hoja de ruta
    this.regData = [];
    for ( let i=0; i < this.checkBoxSelected.length; i++ ){ //[MODIFICAR] Esto se puede hacer de forma mas eficiente
      for ( let c=0; c < this.shippings.length; c++ ){
        if ( Number( this.shippings[ c ].id ) == Number ( this.checkBoxSelected[ i ] ) ){
          this.regData.push( this.shippings[ c ] );
        }
      }
    }

    //se perpara el arreglo de campos seleccionados
    this.fieldsSelected = [];
    for ( let c=0; c < this.config.EnabledFilterFieldOptions.length; c++ ){
      this.fieldsSelected.push( this.config.filterFieldOptions[ this.config.EnabledFilterFieldOptions[ c ] ] );
    }
console.log(this.checkBoxSelected);
    if ( this.output != undefined ){
        this.output.regsSelected   = this.checkBoxSelected;
        this.output.regData        = this.regData;
        this.output.fieldsSelected = this.fieldsSelected;
        this.output.onChangeRegSelected.next( this.output );
    }
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

    this.config.provider.getAll('?expand=originBranchOffice,serviceType,destinationBranchOffice,vehicle&page=' + this.actualPage + this.config.ExtraFilterTerms);
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
    this.updateTableSubject.unsubscribe();
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

    this.checkBoxRegChange();

  }

}
