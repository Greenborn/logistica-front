import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Router }    from '@angular/router';

import { HomePage  }            from './pages/home/home';
import { LoginPage  }           from './pages/auth/login/login.page';
import { AllEnviosPage  }       from './pages/envios/all/all.envios.page';
import { OneEnviosPage  }       from './pages/envios/one/one.envios.page';
import { SucursalesPage }       from './pages/sucursales/all/sucursales.page';
import { VehiculosPage  }       from './pages/vehiculos/all/vehiculos.page';
import { UsuariosPage  }        from './pages/usuarios/all/usuarios.page';
import { EnvioDeliveryNote  }   from './pages/envios/delivery.note/envio.delivery.note';
import { RoadmapEnviosPage  }   from './pages/envios/roadmap/roadmap.envios.page';
import { SuccessPage  }         from './pages/gral/success/success';

import { AuthenticationGuard  } from './services/auth/auth.guard';

const routes: Routes = [
  { path: '',              component: LoginPage },
  { path: 'login',         component: LoginPage },
  { path: 'home',          component: HomePage            , canActivate: [AuthenticationGuard]},
  { path: 'envios',        component: AllEnviosPage       , canActivate: [AuthenticationGuard]},
  { path: 'envios/nuevo',  component: OneEnviosPage       , canActivate: [AuthenticationGuard]},
  { path: 'envios/hojaruta',  component: RoadmapEnviosPage, canActivate: [AuthenticationGuard]},
  { path: 'envios/remito', component: EnvioDeliveryNote   , canActivate: [AuthenticationGuard]},
  { path: 'envios/detalle',component: OneEnviosPage       , canActivate: [AuthenticationGuard]},
  { path: 'sucursales',    component: SucursalesPage      , canActivate: [AuthenticationGuard]},
  { path: 'vehiculos',     component: VehiculosPage       , canActivate: [AuthenticationGuard]},
  { path: 'usuarios',      component: UsuariosPage        , canActivate: [AuthenticationGuard]},
  { path: 'exito',         component: SuccessPage         , canActivate: [AuthenticationGuard]},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
