import { NgModule }                               from '@angular/core';
import { BrowserModule }                          from '@angular/platform-browser';
import { RouteReuseStrategy }                     from '@angular/router';
import { FormsModule }                            from '@angular/forms';
import { HttpClientModule }                       from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen }                    from '@ionic-native/splash-screen/ngx';
import { StatusBar }                       from '@ionic-native/status-bar/ngx';

import { AppComponent }     from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomePage }          from './pages/home/home';
import { LoginPage }         from './pages/auth/login/login.page';
import { AllEnviosPage }     from './pages/envios/all/all.envios.page';
import { OneEnviosPage }     from './pages/envios/one/one.envios.page';
import { SucursalesPage }    from './pages/sucursales/all/sucursales.page';
import { VehiculosPage }     from './pages/vehiculos/all/vehiculos.page';
import { UsuariosPage }      from './pages/usuarios/all/usuarios.page';
import { EnvioDeliveryNote } from './pages/envios/delivery.note/envio.delivery.note';
import { SuccessPage }       from './pages/gral/success/success';

import { SideMenuComponent }     from './component/side-menu/side-menu.component';
import { HeaderComponent }       from './component/header/header.component';
import { LoadingComponent }      from './component/loading/loading.component';
import { ToggleButtonComponent } from './component/side-menu/toggle-button/toggle-button.component';

import { NgbModule }                      from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter }   from './providers/ngb-date-custom-parser-formatter.provider';
import { NgbDateCustomI18 }               from './providers/ngb-date-custom-i18.provider';
import { NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule }        from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    LoginPage,
    AllEnviosPage, OneEnviosPage, EnvioDeliveryNote,
    SucursalesPage,
    VehiculosPage,
    UsuariosPage,
    HeaderComponent, LoadingComponent,
    SuccessPage,
    SideMenuComponent, ToggleButtonComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy,     useClass: IonicRouteStrategy },
    { provide: LocationStrategy,       useClass: HashLocationStrategy },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: NgbDatepickerI18n,      useClass: NgbDateCustomI18 }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
