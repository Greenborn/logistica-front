import { Component, OnInit } from '@angular/core';
import { Subject }           from 'rxjs';
import { Router }    from '@angular/router';

import { GeneralService }       from '../../../services/general.service';
import { AuthService }          from '../../../services/auth/auth.service';
import { ShippingsService }     from '../../../services/shippings.service';
import { BranchOfficesService } from '../../../services/branch.offices.service';
import { FormateoService }      from '../../../services/formateo.service';
import { UsersService }         from '../../../services/users.service';

import { Shipping } from '../../../models/shipping';

@Component({
  selector: 'app-envios-by-user',
  templateUrl: './all.by.user.page.html',
  styleUrls: ['./all.by.user.page.scss'],
})
export class AllEnviosByUserPage implements OnInit {

  public tableConfig:any = {};

  private reloadAllByUserV;
  private updateTable = new Subject();

  public UsersGetAOK;
  public UsersGetAKO;
  public userSelected;
  public usersList;

  constructor(
    public  gral:      GeneralService,
    private auth:      AuthService,
    public  mainS:     ShippingsService,
    private BranchOfS: BranchOfficesService,
    public  format:    FormateoService,
    private router:    Router,
    public  usersS:    UsersService
  ) {
    this.auth.toLoginIfNL();
    this.setConfig();

    this.reloadAllByUserV = this.mainS.reloadAllByUserV.subscribe({  next: ( params: any ) => {
      this.setConfig();
      this.usersS.getAll();
    } });

    //////////////////////////
    // GET USUARIOS
    this.UsersGetAOK = this.usersS.UsersGetAOK.subscribe({  next: ( response : any[]) => {
      this.usersList = response[ 'items' ];

      let user = this.auth.getUserName();
      if ( user == null || user == undefined ){
        this.auth.toLogOut();
      }
      for ( let c=0; c < this.usersList.length; c++ ){
        if ( user == this.usersList[ c ].username ){
          this.userSelected = this.usersList[ c ].id;
          this.aplicar();
        }
      }

    } });

    this.UsersGetAKO = this.usersS.UsersGetAKO.subscribe({  next: ( response : any[]) => {
      //se debería reintentar y/o mostrar mensaje de error
      this.gral.newMensaje( 'Ocurrió un error al recibir el listado de usuarios, recargando.' );
      this.usersS.getAll();
    } });
    this.usersS.getAll();

  }

  aplicar(){
    this.updateTable.next( {
      updateConfig:[
        { key:'ExtraFilterTerms', value: '&filter[user]=' + this.userSelected }
      ]
    } );
  }

  setConfig(){

    this.tableConfig = {
      id: 'allshippingsbyuser',
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

        { field: 'status', comp: [ '=' ],
            controlConfig: {
              label: 'Estado', type:'select', dataSubject: this.mainS.ShippingStatusGetATFOK,
              callbackGetData: () => { this.mainS.getStatusWithSubject(); }
            }
        }
      ],
      updateTableSubject: this.updateTable, waitForUpdateSubject: true,
      ExtraFilterTerms: '',
      provider: this.mainS,
      actionOptions: { edit: true, new: false },
      actionsEnabled: true,
      resaltadoEnabled: true,
      regSelect: false
    };
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.reloadAllByUserV.unsubscribe();
    this.UsersGetAOK.unsubscribe();
    this.UsersGetAKO.unsubscribe();
  }

}
