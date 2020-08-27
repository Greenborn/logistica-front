import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePage  }       from './pages/home/home';
import { LoginPage  }      from './pages/auth/login/login.page';
import { EnviosPage  }     from './pages/envios/all/envios.page';
import { SucursalesPage }  from './pages/sucursales/all/sucursales.page';
import { VehiculosPage  }  from './pages/vehiculos/all/vehiculos.page';
import { UsuariosPage  }   from './pages/usuarios/all/usuarios.page';

const routes: Routes = [
  { path: '',          component: LoginPage },
  { path: 'home',      component: HomePage },
  { path: 'envios',    component: EnviosPage },
  { path: 'sucursales',component: SucursalesPage },
  { path: 'vehiculos', component: VehiculosPage },
  { path: 'usuarios',  component: UsuariosPage },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
