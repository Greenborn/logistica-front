import { NgModule }                               from '@angular/core';
import { BrowserModule }                          from '@angular/platform-browser';
import { RouteReuseStrategy }                     from '@angular/router';
import { FormsModule, ReactiveFormsModule }       from '@angular/forms';
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
import { ResultPage }        from './pages/gral/result/result';
import { RoadmapEnviosPage   } from './pages/envios/roadmap/roadmap.envios.page';
import { AllEnviosByUserPage } from './pages/envios/all.by.user/all.by.user.page';

import { SideMenuComponent }     from './component/side-menu/side-menu.component';
import { HeaderComponent }       from './component/header/header.component';
import { LoadingComponent }      from './component/loading/loading.component';
import { EnviosTableComponent }  from './component/envios-table/envios.table.component';
import { ToggleButtonComponent } from './component/side-menu/toggle-button/toggle-button.component';

import { NgbModule }                      from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter }   from './providers/ngb-date-custom-parser-formatter.provider';
import { NgbDateCustomI18 }               from './providers/ngb-date-custom-i18.provider';
import { NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule }        from '@angular/platform-browser/animations';

import { AuthenticationGuard  } from './services/auth/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    LoginPage,
    AllEnviosPage, OneEnviosPage, EnvioDeliveryNote, RoadmapEnviosPage, AllEnviosByUserPage,
    EnviosTableComponent,
    SucursalesPage,
    VehiculosPage,
    UsuariosPage,
    HeaderComponent, LoadingComponent,
    ResultPage,
    SideMenuComponent, ToggleButtonComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgbModule,
    FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationGuard,
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
