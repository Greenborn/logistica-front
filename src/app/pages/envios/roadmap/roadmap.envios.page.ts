import { Component, OnInit } from '@angular/core';
import { Router }    from '@angular/router';

import { GeneralService }     from '../../../services/general.service';
import { AuthService }        from '../../../services/auth/auth.service';
import { ShippingsService }   from '../../../services/shippings.service';
import { VehicleService }     from '../../../services/vehicles.service';

import { Shipping } from '../../../models/shipping';
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

  private onTableChange;

  private VehicleGetAOK;
  private VehicleGetAKO;

  constructor(
    public  gral:    GeneralService,
    private auth:    AuthService,
    public  mainS:   ShippingsService,
    private vehicleS: VehicleService,
    private router:  Router
  ) {
  }

  ngOnInit() {
    this.auth.toLoginIfNL();

    this.tableConfig = {
      id: 'roadmap',
      resaltado: [
        { 'field':'status', 'enabled':true, 'colors':this.mainS.getStatusColors() }
      ],
      filterFieldOptions: [
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
      EnabledFilterFieldOptions: [ 0, 1, 2, 3, 4, 5, 6 ],
      provider: this.mainS,
      actionOptions: { edit: false, new: false },
      actionsEnabled: false,
      resaltadoEnabled: false,
      regSelect: true
    };

    this.onTableChange = this.tableOutput.onChangeRegSelected.subscribe({  next: ( response ) => {

    } });

    //////////////////////////
    /// GET VEHÍCULOS
    this.VehicleGetAOK = this.vehicleS.VehicleGetAOK.subscribe({  next: ( response : any[]) => {
      this.mainS.VehicleList      = response;
      this.mainS.RoadmapParamsLoaded = true;
    } });

    this.VehicleGetAKO = this.vehicleS.VehicleGetAKO.subscribe({  next: ( response : any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.mainS.RoadmapParamsLoaded = false;
    } });

    if ( !this.mainS.RoadmapParamsLoaded ){
      this.vehicleS.getAll();
    }

  }

  nextRoadMap(){
    
  }

  ngOnDestroy(){
    this.onTableChange.unsubscribe();
    this.VehicleGetAOK.unsubscribe();
    this.VehicleGetAOK.unsubscribe();
  }

}