import { Component, OnInit } from '@angular/core';
import { Router }    from '@angular/router';
import { Subject }           from 'rxjs';

import { GeneralService }     from '../../../services/general.service';
import { AuthService }        from '../../../services/auth/auth.service';
import { ShippingsService }   from '../../../services/shippings.service';
import { VehicleService }     from '../../../services/vehicles.service';
import { PdfService }         from '../../../services/pdf.service';
import { FormateoService }    from '../../../services/formateo.service';
import { RoadmapService }     from '../../../services/roadmap.service';

import { Shipping } from '../../../models/shipping';
import { RoadMap } from '../../../models/roadmap';
import { OutputTableModel } from '../../../component/envios-table/output.table.model';

@Component({
  selector: 'app-envios-roadmap',
  templateUrl: './roadmap.envios.page.html',
  styleUrls: ['./roadmap.envios.page.scss'],
})
export class RoadmapEnviosPage implements OnInit {

  public tableConfig:any = {};
  public tableOutput:OutputTableModel = new OutputTableModel();

  public vehicle_id;
  public vehicleList;

  private onTableChange;
  private updateTable      = new Subject();
  private regsOutput:any   = [];

  private roadMap:RoadMap = new RoadMap();
  private reloadRoadMapV;
  private RoadmapPostOK;
  private RoadmapPostKO;

  private VehicleGetAOK;
  private VehicleGetAKO;

  constructor(
    public  gral:     GeneralService,
    private auth:     AuthService,
    public  mainS:    ShippingsService,
    private roadMapS: RoadmapService,
    private vehicleS: VehicleService,
    private pdfS:     PdfService,
    private router:   Router,
    public  format:   FormateoService,
  ) {
  }

  ngOnInit() {
    this.auth.toLoginIfNL();
    this.pdfS.loadPdfMaker();
    this.setConfig();

    this.reloadRoadMapV = this.roadMapS.reloadRoadMapV.subscribe({  next: ( params: any ) => {
      this.setConfig();
      this.updateTable.next( true );
    } });

    this.onTableChange = this.tableOutput.onChangeRegSelected.subscribe({  next: ( response ) => {
      this.regsOutput  = response;
    } });

    //////////////////////////
    /// GET VEHÍCULOS
    this.VehicleGetAOK = this.vehicleS.VehicleGetAOK.subscribe({  next: ( response : any[]) => {
      this.vehicleList = response[ 'items' ];
      this.vehicle_id = -1;
      this.mainS.RoadmapParamsLoaded = true;
    } });

    this.VehicleGetAKO = this.vehicleS.VehicleGetAKO.subscribe({  next: ( response : any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.mainS.RoadmapParamsLoaded = false;
    } });

    //////////////////////////
    /// ROADMAP
    this.RoadmapPostOK = this.roadMapS.RoadmapPostOK.subscribe({  next: ( response : any[]) => {
      this.gral.dismissLoading();

      this.setregsOutputEmptyFields();
      this.pdfS.generatePdfRoadMap({
        date: this.format.getStringDate( new Date() ),
        name: 'Hoja_de_ruta_',
        regData: this.regsOutput,
        onGenerate: () => {  }
      });
    } });

    this.RoadmapPostKO = this.roadMapS.RoadmapPostKO.subscribe({  next: ( response : any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.gral.dismissLoading();
      this.gral.errMsg( response );

    } });

  }

  setregsOutputEmptyFields(){
    this.regsOutput.fieldsSelected.push( { code:undefined, text:'Nombre receptor' } );
    this.regsOutput.fieldsSelected.push( { code:undefined, text:'DNI receptor' } );
    this.regsOutput.fieldsSelected.push( { code:undefined, text:'Firma receptor' } );
  }

  setConfig(){
    this.tableConfig = {
      id: 'roadmap',
      resaltado: [
        { 'field':'status', 'enabled':false, 'colors':this.mainS.getStatusColors() }
      ],
      filterFieldOptions: [
        { 'code':'id', 'text':'#', 'enabled':true },
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
      ],
      EnabledFilterFieldOptions: [ 0, 1, 2, 3, 4, 5, 6, 7 ],
      ExtraFilterTerms: '&filter[status]=1',
      filterContentOptions: [ ],
      updateTableSubject: this.updateTable,
      provider: this.mainS,
      actionOptions: { edit: false, new: false },
      actionsEnabled: false,
      resaltadoEnabled: false,
      regSelect: true
    };

    this.vehicleS.getAll();
  }

  nextRoadMap(){
    if ( this.regsOutput.regsSelected.length == 0 ){
      this.gral.newMensaje( 'Es necesario seleccionar al menos un envío.' );
      return false;
    }

    this.gral.presentLoading();
    this.roadMap           = new RoadMap();
    this.roadMap.shippings = this.regsOutput.regsSelected;
    if ( this.vehicle_id != -1 ){
      this.roadMap.vehicle_id = this.vehicle_id;
    }
    this.roadMapS.post( this.roadMap );
  }

  ngOnDestroy(){
    this.onTableChange.unsubscribe();
    this.VehicleGetAOK.unsubscribe();
    this.VehicleGetAOK.unsubscribe();
    this.RoadmapPostKO.unsubscribe();
    this.RoadmapPostOK.unsubscribe();
    this.reloadRoadMapV.unsubscribe();
  }

}
