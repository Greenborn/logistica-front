import { Component, OnInit } from '@angular/core';
import { Subject }           from 'rxjs';
import { Router }    from '@angular/router';

import { GeneralService }       from '../../../services/general.service';
import { AuthService }          from '../../../services/auth/auth.service';
import { ShippingsService }     from '../../../services/shippings.service';
import { BranchOfficesService } from '../../../services/branch.offices.service';
import { FormateoService }      from '../../../services/formateo.service';

import { Shipping } from '../../../models/shipping';

@Component({
  selector: 'app-envios-all',
  templateUrl: './all.envios.page.html',
  styleUrls: ['./all.envios.page.scss'],
})
export class AllEnviosPage implements OnInit {

  public tableConfig:any = {};

  private reloadAllV;
  private updateTable = new Subject();

  constructor(
    public  gral:      GeneralService,
    private auth:      AuthService,
    public  mainS:     ShippingsService,
    private BranchOfS: BranchOfficesService,
    public  format:    FormateoService,
    private router:    Router
  ) {
    this.auth.toLoginIfNL();
    this.setConfig();

    this.reloadAllV = this.mainS.reloadAllV.subscribe({  next: ( params: any ) => {
      this.setConfig();
      this.updateTable.next( true );
    } });

  }

  setConfig(){
    this.tableConfig = {
      id: 'roadmap',
      resaltado: [
        { 'field':'status', 'enabled':true, 'colors':this.mainS.getStatusColors() }
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
      filterContentOptions: [
        { field: 'unfiltered', comp: [], controlConfig: { label: 'Sin filtrar' } },
        
        { field: 'date', comp: [ '>', '<', '=', 'between' ],
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

        { field: 'status', comp: [ '=' ],
            controlConfig: {
              label: 'Estado', type:'select', dataSubject: this.mainS.ShippingStatusGetATFOK,
              callbackGetData: () => { this.mainS.getStatusWithSubject(); }
            }
        }
      ],
      updateTableSubject: this.updateTable,
      ExtraFilterTerms: '',
      provider: this.mainS,
      actionOptions: { edit: true, new: true },
      actionsEnabled: true,
      resaltadoEnabled: true,
      regSelect: false
    };
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.reloadAllV.unsubscribe();
  }

}
