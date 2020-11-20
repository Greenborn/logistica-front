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

  public shippings:any = [];

  public actualPage:number = 1;
  public totalRegs:number;
  public pageCount:number;
  public pageLinks:any = [];

  public filtersCollapsed:boolean            = true;
  public resaltadoCollapsed:boolean          = true;
  public filterFieldContentCollapsed:boolean = true;

  public filterFieldContent:any        = { fieldSelec: 'unfiltered', criteriaSelected:null, criteriaOptions:[], compareOptions:[], controlConfig: [], params:['',''] };
  public filterFieldContentStep:number = 0;
  public filterFieldDataForFilter:any  = {}; //{ 'status':{ data:[] } } [INFO] Estructura esperable a almacenar
  public getInfoFFSubscription:any;
  public filterFieldContentTC:any = [
    { id:'=',       description: 'Es igual a' },
    { id:'>',       description: 'Es mayor a' },
    { id:'<',       description: 'Es menor a' },
    { id:'between', description: 'Está entre' },
    { id:'[=]',     description: 'Es igual a' }
  ];

  public  checkBoxArray:any        = [];
  private regData:any              = [];
  private checkBoxSelected:any     = [];
  public  checkBoxGralInfo:any     = [ { checked:true, pristine:true, page:1 } ];
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

    this.checkBoxGralInfo[ this.actualPage ] = { checked:true, pristine:true };

    if ( this.config.updateTableSubject != undefined ){
      this.updateTableSubject = this.config.updateTableSubject.subscribe({  next: ( params : any) => {
        if ( this.auth.logedIn() ){
          this.shippings        = [];
          this.checkBoxArray    = [];
          this.checkBoxGralInfo = {};
          this.actualPage       = 1;

          this.checkBoxGralInfo[ this.actualPage ] = { checked:true, pristine:true };

          //si se especifica actualizacion de configuracion
          if ( params.hasOwnProperty( 'updateConfig' ) ){
            for ( let c=0; c<params.updateConfig.length; c++ ){
              this.config[ params.updateConfig[ c ].key ] = params.updateConfig[ c ].value;
            }
          }

          //si se especificaron filtros, se reinician (por si hubo combio en la config)
          // y se aplica el filtro seleccionado
          if ( this.config.filterContentOptions.length == 0 ){
            this.loadPage( this.actualPage );
          } else {
            this.filtersInic();
            this.filterFieldSelecChange();
            this.applyFilter();
          }

        }
      } });
    }

    if ( !this.config.resaltadoEnabled ){
      this.config.resaltado[ 0 ].enabled = false;
    }

    this.ShippingGetAOK = this.config.provider.ShippingGetAOK.subscribe({  next: ( response : any ) => {
      this.shippings = [];

      for ( let c=0; c < response.items.length; c ++ ){
         let reg:any = {
          receiver_identification_type: response.items[ c ].receiver_identification.identification_type.name,
          sender_identification_type:   response.items[ c ].sender_identification.identification_type.name,
          originBranchOffice:           '-',
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
        };

        if ( response.items[ c ].originBranchOffice != null ) {
          reg.originBranchOffice = response.items[ c ].originBranchOffice.name;
        }

        this.shippings.push( reg );

        if ( response.items[ c ].vehicle != null ){
          this.shippings[ c ].vehicle = response.items[ c ].vehicle.description;
        }

        // si la clave ya existe no se sobreescribe su valor
        if ( !this.checkBoxArray.hasOwnProperty( String( response.items[ c ].id ) ) && this.actualPage != 0 ){
          this.checkBoxArray[ String( response.items[ c ].id ) ] = this.checkBoxGralInfo[ this.actualPage ].checked;
        }

        if ( this.actualPage == 0 ){
          this.actualPage = 1;
        }
      }

      this.totalRegs = response._meta.totalCount;
      this.pageCount = response._meta.pageCount;

      this.pageLinks = [];
      for (let c=1; c <= (response._meta as any).pageCount; c ++){
          this.pageLinks.push( { 'page':c } );
      }

      //Se genera arreglo de checkbox de seleccion general, se define la selección de todos
      //los checkbox de la página actual
      for ( let c=1; c <= this.pageCount; c++ ){
        let check:boolean = false;
        if ( this.actualPage == c ){
          check = true;
        }

        if ( !this.checkBoxGralInfo.hasOwnProperty( c ) ){
          this.checkBoxGralInfo[ c ] = { checked:check, pristine:true };
        }
      }

      this.gral.dismissLoading();
      this.checkBoxRegChange();
    } });

    this.ShippingGetAKO = this.config.provider.ShippingGetAKO.subscribe({  next: ( response : any) => {

    } });

    if ( this.auth.logedIn() && !this.config.hasOwnProperty( 'waitForUpdateSubject' ) ){
      this.loadPage( this.actualPage );
    }

    this.filtersInic();
  }

  filtersInic(){
    //se revisa si está agregada la opción sin filtro, en caso de no estar, se agrega
    let found:boolean = false;
    for ( let c=0; c < this.config.filterContentOptions.length; c++ ){
      if ( this.config.filterContentOptions[ c ].field == 'unfiltered' ){
        found = true;
        break;
      }
    }

    if ( !found ){
      this.filterFieldContent.fieldSelec = 'unfiltered';
    }

    //se agrego para los casos en los que se recargue la vista y ya se tengan filtros seleccionados
    if ( this.filterFieldContent.criteriaSelected == null || this.filterFieldContent.fieldSelec == 'unfiltered' ){
      this.filterFieldContent.params = [];
      this.filterFieldContentStep    = 0;
    }

    /* Se genera el objeto filterFieldDataForFilter que almacenará la información necesaria para desplegar la información de
    los campos de filtrado de tipo select */
    this.filterFieldDataForFilter = {};
    for ( let c=0; c < this.config.filterContentOptions.length; c++ ){
      this.filterFieldDataForFilter[ this.config.filterContentOptions[ c ].field ] = { data:[] };
    }
  }

  filterFieldSelecChange(){
    if ( this.filterFieldContent.fieldSelec == 'unfiltered' ){
      this.filtersInic();
    } else {
      let confFF:any = null;
      for ( let c=0; c < this.config.filterContentOptions.length; c++ ){
          if ( this.config.filterContentOptions[ c ].field == this.filterFieldContent.fieldSelec ){
            confFF = this.config.filterContentOptions[ c ];
            break;
          }
      }

      if ( confFF != null ){
        this.filterFieldContent.controlConfig  = confFF.controlConfig;
        this.filterFieldContent.compareOptions = confFF.comp;

        /*Se verifica si hay funcion para conversión de valores (pre envio)
          si no existe se especifica una funcion que retorna el propio valor
        */
        if ( !this.filterFieldContent.controlConfig.hasOwnProperty( 'formatFunction' ) ) {
          this.filterFieldContent.controlConfig[ 'formatFunction' ] = ( value ) => { return value; };
        }

        /* Se inicializa el arreglo de criterios agregando solo las opciones
        especificadas en la configuración */
        this.filterFieldContent.criteriaOptions = [];
        for ( let c=0; c < this.filterFieldContent.compareOptions.length; c++ ){
          for ( let i=0; i < this.filterFieldContentTC.length; i++ ){
            if ( this.filterFieldContentTC[ i ].id == this.filterFieldContent.compareOptions[ c ] ){
              this.filterFieldContent.criteriaOptions.push( this.filterFieldContentTC[ i ] );
            }
          }
        }

        if ( this.filterFieldContent.criteriaOptions.length > 0 ){
          this.filterFieldContent.criteriaSelected = this.filterFieldContent.criteriaOptions[ 0 ].id;
          this.filterFieldContentStep = 1;
        } else {
          console.error( 'El arreglo de criterio de filtrado esta vacío!!.' );
        }

        /* si se trata de un control que necesita cargar información para hacer el filtrado
          (como los select) se llama al callback para btener la información */

        //Se procede a hacer la subscripción al subject provisto, a la espera de obtención de la información necesaria
        if ( this.filterFieldContent.controlConfig.hasOwnProperty( 'dataSubject' ) ){
            this.getInfoFFSubscription = this.filterFieldContent.controlConfig.dataSubject.subscribe({  next: ( data : any) => {
              //se espera que la "data" ya venga formateada de la forma necesaria para el control
              this.filterFieldDataForFilter[ this.filterFieldContent.fieldSelec ].data   = data;
              this.filterFieldContentStep                                                = 2;
              this.getInfoFFSubscription.unsubscribe();

              //si se trata de un select se selecciona la primera opcion
              if ( this.filterFieldContent.controlConfig.type == 'select' ){
                if ( this.filterFieldDataForFilter[ this.filterFieldContent.fieldSelec ].data ){
                  this.filterFieldContent.params[ 0 ] = this.filterFieldDataForFilter[ this.filterFieldContent.fieldSelec ].data[ 0 ].id;
                } else {
                  console.error( 'No hay datos para el selector!' );
                }
              }
            } });

        } else if ( this.filterFieldContent.controlConfig.type == 'select' ) {
            console.error( 'Es necesario especificar la subscripción para la obtención de información para el control' );
        }

        //se mantiene actualizada la vista dependiendo del criterio seleccionado
        this.filterFieldSelecCriteriaChange();

        /* Se procede a ejecutar la función pasada como callback que deberá disparar los
          mecanismos necesarios para obtener un evento de la subscripción (subscrita un par de lineas atras)
        */
        if ( this.filterFieldContent.controlConfig.hasOwnProperty( 'callbackGetData' ) ){
            this.filterFieldContent.controlConfig.callbackGetData();
        } else if ( this.filterFieldContent.controlConfig.type == 'select' ) {
            console.error( 'Es necesario especificar el método para la obtención de información para el control' );
        }

      }

    }
  }

  filterFieldSelecCriteriaChange(){
    //Si el filtro seleccionado no tiene origenes de datos se pasa directo al paso 2
    if ( !this.filterFieldContent.controlConfig.hasOwnProperty( 'dataSubject' ) ){
      this.filterFieldContentStep = 2;
    }
  }

  checkAllClick(){
    for ( let c = 0; c < this.shippings.length; c++ ){
      this.checkBoxArray[ this.shippings[ c ].id ]      = this.checkBoxGralInfo[ this.actualPage ].checked;
      this.checkBoxGralInfo[ this.actualPage ].pristine = false;
    }

    this.checkBoxRegChange();
  }

  //ahora solo se fija de que esten seteados los valores
  validateFilterParams(){
    if ( this.filterFieldContent.params.length == 0 ){
      return false
    }

    if ( this.filterFieldContent.criteriaSelected == 'between' ) {
      if ( this.filterFieldContent.params[ 0 ] == '' || this.filterFieldContent.params[ 1 ] == '' || this.filterFieldContent.params[ 0 ] == undefined || this.filterFieldContent.params[ 1 ] == undefined ) {
        return false;
      }

      if ( this.filterFieldContent.controlConfig.type == 'date' && ( !this.filterFieldContent.params[ 0 ].hasOwnProperty('year') || !this.filterFieldContent.params[ 1 ].hasOwnProperty('year') ) ) {
        return false;
      }

      if ( this.filterFieldContent.controlConfig.type == 'number' && ( isNaN(this.filterFieldContent.params[ 0 ]) || isNaN(this.filterFieldContent.params[ 1 ]) ) ){
        return false;
      }
    }

    if ( this.filterFieldContent.params[ 0 ] == '' || this.filterFieldContent.params[ 0 ] == null ){
      return false;
    }

    if ( this.filterFieldContent.controlConfig.type == 'number' && isNaN(this.filterFieldContent.params[ 0 ]) ){
      return false;
    }

    return true;
  }

  getFilterParams(){
    let out:string = '';
    let values:any = [0,0];

    values[ 0 ] = this.filterFieldContent.controlConfig.formatFunction( this.filterFieldContent.params[ 0 ] );
    values[ 1 ] = this.filterFieldContent.controlConfig.formatFunction( this.filterFieldContent.params[ 1 ] );

    switch ( this.filterFieldContent.criteriaSelected ) {
      case '=':
        out = '&filter[' + this.filterFieldContent.fieldSelec + ']' + '=' + values[ 0 ];
        break;

      case '[=]':
        out = '&filter[' + this.filterFieldContent.fieldSelec + '][inside]' + '=' + values[ 0 ] + ',' + ( Number( values[ 0 ] ) + 1000*60*60*24 );
        break;

      case '>':
        out = '&filter[' + this.filterFieldContent.fieldSelec + ']' + '=' + this.filterFieldContent.criteriaSelected;  //[MODIFICAR] Esto solo va para la fecha, en otro issue se deberia mejorar
        if ( this.filterFieldContent.controlConfig.type == 'date' ) {
          out += ( Number( values[ 0 ] ) + 1000*60*60*24 );
        } else {
          out += Number( values[ 0 ] );
        }
        break;

      case '<':
        out = '&filter[' + this.filterFieldContent.fieldSelec + ']' + '=' + this.filterFieldContent.criteriaSelected;  //[MODIFICAR] Esto solo va para la fecha, en otro issue se deberia mejorar
        if ( this.filterFieldContent.controlConfig.type == 'date' ) {
          out += ( Number( values[ 0 ] ) + 1000*60*60*24 );
        } else {
          out += Number( values[ 0 ] );
        }
        break;

      case 'between':
        out = '&filter[' + this.filterFieldContent.fieldSelec + ']' + '[' + this.filterFieldContent.criteriaSelected + ']=' + values[ 0 ] + ',' + values[ 1 ];
        break;

      default:
        console.error('? comparador inválido!');
        break;
    }

    return out;
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

    if ( this.output != undefined ){
        this.returnOutput();
    }
  }

  returnOutput(){
    this.output.regsSelected   = this.checkBoxSelected;
    this.output.regData        = this.regData;
    this.output.fieldsSelected = this.fieldsSelected;
    this.output.filtersUsed    = this.filterFieldContent;
    this.output.onChangeRegSelected.next( this.output );
  }

  showFiltersFields(){
    this.filtersCollapsed            = !this.filtersCollapsed;
    this.filterFieldContentCollapsed = true;
    this.resaltadoCollapsed          = true;
  }

  showFiltersFieldC(){
    this.filterFieldContentCollapsed = !this.filterFieldContentCollapsed;
    this.resaltadoCollapsed          = true;
    this.filtersCollapsed            = true;
  }

  showResaltado(){
    this.resaltadoCollapsed          = !this.resaltadoCollapsed;
    this.filterFieldContentCollapsed = true;
    this.filtersCollapsed            = true;
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

    let params:string = '?expand=originBranchOffice,serviceType,destinationBranchOffice,vehicle&page=' + this.actualPage + this.config.ExtraFilterTerms;

    if ( this.filterFieldContent.fieldSelec != 'unfiltered' ){
      if ( !this.validateFilterParams() ){
          this.gral.newMensaje( 'Revise los filtros, criterio erroneo.' );
          return false;
      }

      params += this.getFilterParams();
    }

    this.config.provider.getAll( params );
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
