import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePage  }            from './pages/home/home';
import { LoginPage  }           from './pages/auth/login/login.page';
import { AllEnviosPage  }       from './pages/envios/all/all.envios.page';
import { OneEnviosPage  }       from './pages/envios/one/one.envios.page';
import { SucursalesPage }       from './pages/sucursales/all/sucursales.page';
import { VehiculosPage  }       from './pages/vehiculos/all/vehiculos.page';
import { UsuariosPage  }        from './pages/usuarios/all/usuarios.page';
import { EnvioDeliveryNote  }   from './pages/envios/delivery.note/envio.delivery.note';
import { SuccessPage  }         from './pages/gral/success/success';

const routes: Routes = [
  { path: '',              component: LoginPage },
  { path: 'home',          component: HomePage },
  { path: 'envios',        component: AllEnviosPage },
  { path: 'envios/nuevo',  component: OneEnviosPage },
  { path: 'envios/remito', component: EnvioDeliveryNote },
  { path: 'sucursales',    component: SucursalesPage },
  { path: 'vehiculos',     component: VehiculosPage },
  { path: 'usuarios',      component: UsuariosPage },
  { path: 'exito',         component: SuccessPage },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
