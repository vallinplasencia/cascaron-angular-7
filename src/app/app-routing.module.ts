import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './template/page-not-found/page-not-found.component';
import { HomeComponent } from './template/home/home.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { SidebarConfiguracionComponent } from './template/sidebar/sidebar-configuracion/sidebar-configuracion.component';
import { SidebarActivosComponent } from './template/sidebar/sidebar-activos/sidebar-activos.component';
import { LoginComponent } from './seguridad/login/login.component';
import { CanDeactivateGuard } from './util/guards/can-deactivate.guard';
import { LogoutComponent } from './seguridad/logout/logout.component';
import { UsuarioAutenticadoGuard } from './util/guards/usuario-autenticado.guard';
import { UsuarioNoAutenticadoGuard } from './util/guards/usuario-no-autenticado.guard';
import { ComprobarComponent } from './comprobar/comprobar.component';
import { RoleAutorizarGuard } from './util/guards/role-autorizar.guard';
import { TipoRoles } from './util/tipo-roles';
import { SidebarSeguridadComponent } from './template/sidebar/sidebar-seguridad/sidebar-seguridad.component';
import { SidebarActividadesComponent } from './template/sidebar/sidebar-actividades/sidebar-actividades.component';
import { SidebarMisactividadesComponent } from './template/sidebar/sidebar-misactividades/sidebar-misactividades.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'actividades',
    data:{
      roles: [
        TipoRoles.ROLE_ADMIN
      ]
    },
    canActivate: [RoleAutorizarGuard],
    loadChildren: "./actividades/actividades.module#ActividadesModule"
  },
  {
    path: 'mis-actividades',
    data:{
      roles: [
        TipoRoles.ROLE_ADMIN, 
        TipoRoles.ROLE_USUARIO
      ]
    },
    canActivate: [RoleAutorizarGuard],
    loadChildren: "./mis-actividades/mis-actividades.module#MisActividadesModule"
  },


  //****Rutas de Sidebar. Rutas secundarias. Outlet nombrado con sidebar
  {
    path: 'actividad',
    component: SidebarActividadesComponent,
    outlet: 'sidebar'
  },
  {
    path: 'misactividad',
    component: SidebarMisactividadesComponent,
    outlet: 'sidebar'
  },


  {
    path: 'seguridad',
    component: SidebarSeguridadComponent,
    outlet: 'sidebar'
  },
  //****FIN. Rutas de Sidebar...


  
  //Rutas que no se encuentran en la app.
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
