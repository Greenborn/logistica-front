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
import { BranchOfficesService } from '../../../services/branch.offices.service';

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
    private BranchOfS: BranchOfficesService,
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
    /// GET VEH??CULOS
    this.VehicleGetAOK = this.vehicleS.VehicleGetAOK.subscribe({  next: ( response : any[]) => {
      this.vehicleList = response[ 'items' ];
      this.vehicle_id = -1;
      this.mainS.RoadmapParamsLoaded = true;
    } });

    this.VehicleGetAKO = this.vehicleS.VehicleGetAKO.subscribe({  next: ( response : any[]) => {
      //se deber??a reintentar y/o mostrar mensaje de error
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

      this.updateTable.next( true );
    } });

    this.RoadmapPostKO = this.roadMapS.RoadmapPostKO.subscribe({  next: ( response : any[]) => {
      //se deber??a reintentar y/o mostrar mensaje de error
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
        { 'code':'origin_address', 'text':'Direcci??n de Origen', 'enabled':false },
        { 'code':'destination_address', 'text':'Direcci??n de Destino', 'enabled':false },
        { 'code':'payment_at_origin', 'text':'Pagado en Origen', 'enabled':false },
        { 'code':'serviceType', 'text':'Tipo de Servicio', 'enabled':false },
        { 'code':'sender_identification', 'text':'Identificaci??n Remitente', 'enabled':false },
        { 'code':'receiver_identification', 'text':'Identificaci??n Destinatario', 'enabled':false },
        { 'code':'receiver_identification_type', 'text':'Tipo de Identificaci??n Destinatario', 'enabled':false },
        { 'code':'sender_identification_type', 'text':'Tipo de Identificaci??n Remitente', 'enabled':false },
        { 'code':'vehicle', 'text':'Veh??culo', 'enabled':false }
      ],
      EnabledFilterFieldOptions: [ 0, 1, 2, 3, 4, 5, 6, 7 ],
      ExtraFilterTerms: '&filter[status]=1',
      filterContentOptions: [
        { field: 'unfiltered', comp: [], controlConfig: { label: 'Sin filtrar' } },

        { field: 'id', comp: [ '>', '<', '=', 'between' ],
            controlConfig: { label: 'Id', type:'number' }
        },

        { field: 'date', comp: [ '>', '<', '[=]', 'between' ],
            controlConfig: { label: 'Fecha', type:'date', formatFunction: ( value ) => { return this.format.getTimeStampFNgbDatePickerA( value ); } }
        },

        { field: 'originBranchOffice', comp: [ '=' ],
            controlConfig: {
              label: 'Sucursal de Origen', type:'select', dataSubject: this.BranchOfS.BranchOfficeGetATFOK,
              callbackGetData: () => { this.BranchOfS.getAlltoTableFilter(); }
            }
        },

        { field: 'destinationBranchOffice', comp: [ '=' ],
            controlConfig: {
              label: 'Sucursal de Destino', type:'select', dataSubject: this.BranchOfS.BranchOfficeGetATFOK,
              callbackGetData: () => { this.BranchOfS.getAlltoTableFilter(); }
            }
        },
      ],
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
      this.gral.newMensaje( 'Es necesario seleccionar al menos un env??o.' );
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
