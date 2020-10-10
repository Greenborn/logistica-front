//Este componente tiene como finalida centralizar todas las funciones comunes
//que utilizarían todas las páginas, como los mensajes de alerta, loadings, etc.
// Esto es asi, por que al parecer no es una practica buena extender páginas en Angular
import { Injectable }        from '@angular/core';
import { AlertController }   from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class GeneralService {

  public loadingPresent = false;

  private errorGenericText = 'Ha ocurrido un error no especificado, por favor reintente luego.';

  constructor(
    public alertController: AlertController
  ) { }

  getAppTitle(){
    return 'Logística Tandil';
  }

  async newMensaje(msg){
    let alert = await this.alertController.create({
      header: 'Atención',
      subHeader: '',
      message: msg,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  dismissLoading(){
    this.loadingPresent = false;
  }

  presentLoading(d=0){
    this.loadingPresent = true;
  }

  errMsg( response:any ){
    if ( response.hasOwnProperty( 'error' ) ){
      if ( response.error.hasOwnProperty( 'message' ) ){
        this.newMensaje( response.error.message );
      } else {
        this.newMensaje( this.errorGenericText );
      }
    }
  }

}
