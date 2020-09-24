import { Component, OnInit, ElementRef }         from '@angular/core';
import { Router, ActivatedRoute }    from '@angular/router';
import { FormGroup, FormControl, ValidationErrors, FormBuilder, Validators, FormsModule, ReactiveFormsModule }   from '@angular/forms'

import { GeneralService }       from '../../../services/general.service';
import { AuthService }          from '../../../services/auth/auth.service';
import { ShippingsService }     from '../../../services/shippings.service';
import { BranchOfficesService } from '../../../services/branch.offices.service';
import { ServicesService }      from '../../../services/services.service';
import { DistancesService }     from '../../../services/distances.service';
import { IdentificationService }from '../../../services/identification.service';
import { VehicleService }       from '../../../services/vehicles.service';
import { FormateoService }      from '../../../services/formateo.service';

import { ShippingItem }     from '../../../models/shipping.item';
import { Shipping     }     from '../../../models/shipping';
import { ShippingResponse } from '../../../models/shipping.response';

@Component({
  selector: 'app-envios-one',
  templateUrl: './one.envios.page.html',
  styleUrls: ['./one.envios.page.scss'],
})
export class OneEnviosPage implements OnInit {

  private DistancesGetAOK;
  private DistancesGetAKO;
  private BranchOfficeGetAOK;
  private BranchOfficeGetAKO;
  private ServiceGetAOK;
  private ServiceGetAKO;
  private ShippingTypeGetAOK;
  private ShippingTypeGetAKO;
  private ShippingPostOK;
  private ShippingPostKO;
  private IdentificationTypeGetAOK;
  private IdentificationTypeGetAKO;
  private ShippingGetOK;
  private ShippingGetKO;
  private ShippingPutOK;
  private ShippingPutKO;
  private VehicleGetAOK;
  private VehicleGetAKO;

  private services_l_loaded:boolean   = false;
  private shippings_l_loaded:boolean  = false;
  private distances_l_loaded:boolean  = false;
  private branch_of_l_loaded:boolean  = false;
  private identifyT_l_loaded:boolean  = false;
  private vehicle_l_loaded:boolean    = false;
  public  form;

  public shippngItem              = new ShippingItem();
  public shipping                 = new Shipping();
  public payInDestination:boolean = false;
  public payInOrigin:boolean      = true;
  public viewData:any             = { originBranchOffice:{} };

  public creationParamsLoaded:boolean = false;
  public servicesTypes:any;
  public shippingsTypes:any;
  public distancesList:any;
  public identifyTList:any;
  public branchOfficeList:any;
  public VehicleList:any;
  public deliveryNotes:any = { 'original':'', 'doubled':'', 'tripled':'', 'cuadrupled':'' };
  public enableEditionText:string = 'Habilitar Edición';

  constructor(
    public  gral:          GeneralService,
    private auth:          AuthService,
    private vehicleS:      VehicleService,
    private formBuilder:   FormBuilder,
    public  mainS:         ShippingsService,
    public  BranchOfficeS: BranchOfficesService,
    public  distanceS:     DistancesService,
    public  serviceS:      ServicesService,
    public  identifyTS:    IdentificationService,
    public  router:        Router,
    public  elements:      ElementRef,
    public  format:        FormateoService
  ) {
  }

  formSetDisabledState(){
    const state = !this.mainS.elementEnableEdition ? 'disable' : 'enable';

    Object.keys(this.form.controls).forEach((controlName) => {
        this.form.controls[controlName][state]();
    });
  }

  resaltaInputError(id:string){
    let e   = this.elements.nativeElement.querySelectorAll(id)[0];
    if (e !== undefined){
      e.style = "border-color:red; background:#FAA;";
      e.focus();
    }
  }

  resetResaltadoInputError(){
    let e = this.elements.nativeElement.querySelectorAll('.form-control');
    for (let c=0; c < e.length; c++){
      e[c].style = "border-color:rgb(206, 212, 218); background:#FFF;";
    }
  }

  ngOnInit() {
    this.auth.toLoginIfNL();

    if ( this.mainS.action == '' ){
      this.mainS.goToCreate();
    }

    this.form = new FormGroup({
        origin_full_name:          new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        sender_identification_t:   new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        sender_identification_v:   new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        origin_contact:            new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        origin_address:            new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        payment_at_origin:         new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        destination_full_name:     new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        receiver_identification_t: new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        receiver_identification_v: new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        destination_contact:       new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        destination_branch_office: new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        destination_address:       new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        distance_id:               new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        shipping_type_id:          new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        service_type_id:           new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
        vehicle_id:                new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition } ),
        status:                    new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition } ),
        price:                     new FormControl({ value: '', disabled: !this.mainS.elementEnableEdition }, Validators.required),
    });

    //////////////////////////
    /// GET - INFO ENVIO
    this.ShippingGetOK = this.mainS.ShippingGetOK.subscribe({  next: ( response:ShippingResponse ) => {
      this.shipping.setValuesFromResponse( response );

      this.viewData.originBranchOffice = response.originBranchOffice;

      this.deliveryNotes.original   = response.remitos.original   + '&token=' + this.auth.getToken();
      this.deliveryNotes.doubled    = response.remitos.doubled    + '&token=' + this.auth.getToken();
      this.deliveryNotes.tripled    = response.remitos.tripled    + '&token=' + this.auth.getToken();
      this.deliveryNotes.cuadrupled = response.remitos.cuadrupled + '&token=' + this.auth.getToken();

      this.payInDestination = !this.shipping.payment_at_origin;
      this.gral.dismissLoading();
    } });

    this.ShippingGetKO = this.mainS.ShippingGetKO.subscribe({  next: ( response : any[]) => {
      this.gral.dismissLoading();
    } });

    //////////////////////////
    /// GET VEHÍCULOS
    this.VehicleGetAOK = this.vehicleS.VehicleGetAOK.subscribe({  next: ( response : any[]) => {
      this.VehicleList      = response;
      this.vehicle_l_loaded = true;

      this.proveNotifyAParamsLoaded();

    } });

    this.VehicleGetAKO = this.vehicleS.VehicleGetAKO.subscribe({  next: ( response : any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.vehicle_l_loaded = false;
    } });


    //////////////////////////
    /// GET TIPOS DE IDENTIFICACIÓN
    this.IdentificationTypeGetAOK = this.identifyTS.IdentificationTypeGetAOK.subscribe({  next: ( response : any[]) => {
      this.identifyTList      = response;
      this.identifyT_l_loaded = true;

      this.proveNotifyAParamsLoaded();

    } });

    this.IdentificationTypeGetAKO = this.identifyTS.IdentificationTypeGetAKO.subscribe({  next: ( response : any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.identifyT_l_loaded = false;
    } });

    ///////////////////////
    /// GET - DISTANCIAS
    this.DistancesGetAOK = this.distanceS.DistancesGetAOK.subscribe({  next: ( response : any[]) => {
      this.distancesList      = response;
      this.distances_l_loaded = true;

      this.proveNotifyAParamsLoaded();

    } });

    this.DistancesGetAKO = this.distanceS.DistancesGetAKO.subscribe({  next: ( response : any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.distances_l_loaded = false;
    } });

    ///////////////////////
    /// GET - SUCURSALES
    this.BranchOfficeGetAOK = this.BranchOfficeS.BranchOfficeGetAOK.subscribe({  next: ( response : any[]) => {
      this.branchOfficeList   = this.BranchOfficeS.filterEActualOffice( response );
      this.branch_of_l_loaded = true;

      this.proveNotifyAParamsLoaded();

    } });

    this.BranchOfficeGetAKO = this.BranchOfficeS.BranchOfficeGetAKO.subscribe({  next: ( response : any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.branch_of_l_loaded = false;
    } });

    /////////////////////
    /// GET - TIPOS DE SERVICIOS
    this.ServiceGetAOK = this.serviceS.ServiceGetAOK.subscribe({  next: ( response : any[]) => {
      this.servicesTypes     = response;
      this.services_l_loaded = true;

      this.proveNotifyAParamsLoaded();

    } });

    this.ServiceGetAKO = this.serviceS.ServiceGetAKO.subscribe({  next: ( response : any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.services_l_loaded = false;
    } });

    //////////////////////
    /// GET - ENVIOS
    this.ShippingTypeGetAOK = this.mainS.ShippingTypeGetAOK.subscribe({  next: ( response : any[]) => {
      this.shippingsTypes     = response;
      this.shippings_l_loaded = true;

      this.proveNotifyAParamsLoaded();
    } });

    this.ShippingTypeGetAKO = this.mainS.ShippingTypeGetAKO.subscribe({  next: ( response : any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.shippings_l_loaded = false;
    } });

    //////////////////
    /// PUT - EDITAR ENVÍO
    this.ShippingPutOK = this.mainS.ShippingPutOK.subscribe({  next: ( response : any[]) => {
      this.mainS.get();
      this.mainS.goToAll();
    } });

    this.ShippingPutKO = this.mainS.ShippingPutKO.subscribe({  next: ( response : any[]) => {
      this.gral.newMensaje( 'Ha ocurrido un error, reintente nuevamente.' );
      this.gral.dismissLoading();
    } });

    //////////////////
    /// POST - NUEVO ENVIO
    this.ShippingPostOK = this.mainS.ShippingPostOK.subscribe({  next: ( response : any[]) => {
      this.mainS.goToAll();
    } });

    this.ShippingPostKO = this.mainS.ShippingPostKO.subscribe({  next: ( response : any[]) => {
      this.gral.newMensaje( 'Ha ocurrido un error, reintente nuevamente.' );
      this.gral.dismissLoading();
    } });

    if ( !this.creationParamsLoaded ){
      this.gral.presentLoading();
      this.serviceS.getAll();
      this.BranchOfficeS.getAll();
      this.distanceS.getAll();
      this.identifyTS.getAll();
      this.mainS.getTypes();
      this.vehicleS.getAll();
    }

    this.resetResaltadoInputError();
  }

  private proveNotifyAParamsLoaded(){
    if ( this.services_l_loaded && this.shippings_l_loaded && this.distances_l_loaded && this.branch_of_l_loaded && this.identifyT_l_loaded && this.vehicle_l_loaded ){
      this.creationParamsLoaded = true;
      this.gral.dismissLoading();
    }
  }

  editionEnable(){
    this.mainS.elementEnableEdition = !this.mainS.elementEnableEdition;
    this.formSetDisabledState();

    if ( this.mainS.elementEnableEdition ){
        this.enableEditionText = 'Deshabilitar Edición';
    } else {
        this.enableEditionText = 'Habilitar Edición';
    }
  }

  ngOnDestroy(){
    this.DistancesGetAOK.unsubscribe();
    this.DistancesGetAKO.unsubscribe();
    this.BranchOfficeGetAOK.unsubscribe();
    this.BranchOfficeGetAKO.unsubscribe();
    this.ServiceGetAOK.unsubscribe();
    this.ServiceGetAKO.unsubscribe();
    this.ShippingTypeGetAOK.unsubscribe();
    this.ShippingTypeGetAKO.unsubscribe();
    this.ShippingPostOK.unsubscribe();
    this.ShippingPostKO.unsubscribe();
    this.IdentificationTypeGetAOK.unsubscribe();
    this.IdentificationTypeGetAKO.unsubscribe();
    this.ShippingGetOK.unsubscribe();
    this.ShippingGetKO.unsubscribe();
    this.ShippingPutOK.unsubscribe();
    this.ShippingPutKO.unsubscribe();
    this.VehicleGetAOK.unsubscribe();
    this.VehicleGetAOK.unsubscribe();
  }

  addItem(){
    this.shipping.items.push( { 'description': this.shippngItem.description } );
    this.shippngItem = new ShippingItem();
  }

  delItem(i){
    this.shipping.items.splice(i, 1);
  }

  payNDestination(){
    this.payInOrigin = !this.payInDestination;
  }

  payNOrigin(){
    this.payInDestination = !this.payInOrigin;
  }

  next(){
    this.resetResaltadoInputError();
    let tieneError = false;

    Object.keys(this.form.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              this.resaltaInputError( '#' + key );
              tieneError = true;
            });
      }
    });

    if ( tieneError ){
      this.gral.newMensaje( 'Revise el formulario, tiene errores.' );
      return false;
    }

    if ( this.mainS.validateModel( this.shipping ) ){
      if ( this.mainS.action == 'edit' ){
          this.mainS.put( this.shipping );
      } else if ( this.mainS.action == 'create' ) {
          this.mainS.post( this.shipping );
      }
    } else {
      this.gral.newMensaje( this.mainS.validationErrors );
    }
  }

}
