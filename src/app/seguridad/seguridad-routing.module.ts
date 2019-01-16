import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarComponent } from './registrar/registrar.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { UsuarioRolesResolverService } from './usuario-roles-resolver.service';
import { CambiarClaveComponent } from './cambiar-clave/cambiar-clave.component';
import { UsuarioNoAutenticadoGuard } from '../util/guards/usuario-no-autenticado.guard';
import { UsuarioAutenticadoGuard } from '../util/guards/usuario-autenticado.guard';
import { CanDeactivateGuard } from '../util/guards/can-deactivate.guard';

const seguridadRoutes: Routes = [
  //   { path: 'xxx', redirectTo: '/yyy' },
  //   { path: 'xx/:id', redirectTo: '/yy/:id' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UsuarioNoAutenticadoGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [UsuarioAutenticadoGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'cambiar-clave',
    component: CambiarClaveComponent
  },
  {
    path: 'seguridad/registrar',
    component: RegistrarComponent,
    resolve: {
      itemData: UsuarioRolesResolverService
    }
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(seguridadRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SeguridadRoutingModule { }
