//Este componente tiene como finalida centralizar todas las funciones comunes
//que utilizarían todas las páginas, como los mensajes de alerta, loadings, etc.
// Esto es asi, por que al parecer no es una practica buena extender páginas en Angular
import { Injectable }        from '@angular/core';
import { AlertController, LoadingController }   from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class GeneralService {

  private loading   = null;
  private appTitle = 'Logística Tandil';

  constructor(
    public alertController: AlertController,
    public loadingCtrl:     LoadingController
  ) { }

  public getAppTitle(){
    return this.appTitle;
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

  async dismissLoading(){
    if (this.loading === null){
     // this.presentLoading();
    }
    await this.loading.dismiss();
  }

  async presentLoading(d=0){
    this.loading = await this.loadingCtrl.create({ message: 'Por favor espere...', duration: d});

    await this.loading.present();
  }

  errMsg(r){

  }

}
