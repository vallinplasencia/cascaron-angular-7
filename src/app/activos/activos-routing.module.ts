import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '../util/guards/can-deactivate.guard';
import { ActivosComponent } from './activos.component';
import { ActivoListarComponent } from './activo/activo-listar/activo-listar.component';
import { ActivoMostrarComponent } from './activo/activo-mostrar/activo-mostrar.component';
import { ActivoResolverService } from './activo/activo-resolver.service';
import { ActivoNuevoComponent } from './activo/activo-nuevo/activo-nuevo.component';
import { ActivoCamposResolverService } from './activo/activo-campos-resolver.service';
import { ActivoEditarComponent } from './activo/activo-editar/activo-editar.component';
import { ActivoYCamposResolverService } from './activo/activo-y-campos-resolver.service';

const routes: Routes = [
  {
    path: '',
    children: [
      //Categorias
      {
        path: 'activo',
        component: ActivosComponent,
        children: [
          {
            path: '',
            component: ActivoListarComponent,
            canDeactivate: [CanDeactivateGuard]
          },      
          {
            path: 'nuevo',
            component: ActivoNuevoComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve:{
              itemData: ActivoCamposResolverService
            }
          },
          {
            path: 'editar/:id',
            component: ActivoEditarComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: ActivoYCamposResolverService
            }
          },
          {
            path: ':id',
            component: ActivoMostrarComponent, 
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: ActivoResolverService
            }
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ActivosRoutingModule { }
