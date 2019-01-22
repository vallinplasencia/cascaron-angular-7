import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActividadesComponent } from './actividades.component';
import { ActividadNuevaComponent } from './actividad/actividad-nueva/actividad-nueva.component';
import { CanDeactivateGuard } from '../util/guards/can-deactivate.guard';
import { ActividadCamposResolverService } from './actividad/actividad-campos-resolver.service';
import { ActividadListarComponent } from './actividad/actividad-listar/actividad-listar.component';
import { ActividadMostrarComponent } from './actividad/actividad-mostrar/actividad-mostrar.component';
import { ActividadResolverService } from './actividad/actividad-resolver.service';
import { ActividadEditarComponent } from './actividad/actividad-editar/actividad-editar.component';
import { ActividadYCamposResolverService } from './actividad/actividad-y-campos-resolver.service';

const rutasActividades: Routes = [
  {
    path: '',
    children: [
      {
        path: 'actividad',
        component: ActividadesComponent,
        children: [
          {
            path: '',
            component: ActividadListarComponent,
            canDeactivate: [CanDeactivateGuard]
          },      
          {
            path: 'nueva',
            component: ActividadNuevaComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve:{
              itemData: ActividadCamposResolverService
            }
          },
          {
            path: 'editar/:id',
            component: ActividadEditarComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: ActividadYCamposResolverService
            }
          },
          {
            path: ':id',
            component: ActividadMostrarComponent, 
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: ActividadResolverService
            }
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(rutasActividades)],
  exports: [RouterModule]
})
export class ActividadesRoutingModule { }
