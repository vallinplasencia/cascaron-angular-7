import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MisActividadesComponent } from './mis-actividades.component';
import { CanDeactivateGuard } from '../util/guards/can-deactivate.guard';
import { MisActividadesAsignadasListarComponent } from './mis-actividades-asignadas-listar/mis-actividades-asignadas-listar.component';
import { MisActividadesAsignadasMostrarComponent } from './mis-actividades-asignadas-mostrar/mis-actividades-asignadas-mostrar.component';
import { MiActividadAsignadaResolverService } from './mi-actividad-asignada-resolver.service';

const routes: Routes = [{
  path: '',
    children: [
      {
        path: '',
        component: MisActividadesComponent,
        children: [
          {
            path: 'asignadas',
            component: MisActividadesAsignadasListarComponent,
            canDeactivate: [CanDeactivateGuard]
          },      
          // {
          //   path: 'nueva',
          //   component: ActividadNuevaComponent,
          //   canDeactivate: [CanDeactivateGuard],
          //   resolve:{
          //     itemData: ActividadCamposResolverService
          //   }
          // },
          // {
          //   path: 'editar/:id',
          //   component: ActividadEditarComponent,
          //   canDeactivate: [CanDeactivateGuard],
          //   resolve: {
          //     itemData: ActividadYCamposResolverService
          //   }
          // },
          {
            path: 'asignadas/:id',
            component: MisActividadesAsignadasMostrarComponent, 
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: MiActividadAsignadaResolverService
            }
          },
        ]
      },
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisActividadesRoutingModule { }
