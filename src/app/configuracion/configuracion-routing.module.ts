import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionComponent } from './configuracion.component';
import { CategoriaNuevaComponent } from './categoria/categoria-nueva/categoria-nueva.component';
import { CategoriaListarComponent } from './categoria/categoria-listar/categoria-listar.component';
import { CanDeactivateGuard } from '../util/guards/can-deactivate.guard';
import { CategoriaMostrarComponent } from './categoria/categoria-mostrar/categoria-mostrar.component';
import { CategoriaResolverService } from './categoria/categoria-resolver.service';
import { CategoriaEditarComponent } from './categoria/categoria-editar/categoria-editar.component';

const routes: Routes = [
  {
    path: '',
    children: [
      //Categorias
      {
        path: 'categoria',
        component: ConfiguracionComponent,
        children: [
          {
            path: '',
            component: CategoriaListarComponent,
            canDeactivate: [CanDeactivateGuard]
          },      
          {
            path: 'nueva',
            component: CategoriaNuevaComponent,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'editar/:id',
            component: CategoriaEditarComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: CategoriaResolverService
            }
          },
          {
            path: ':id',
            component: CategoriaMostrarComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              itemData: CategoriaResolverService
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
export class ConfiguracionRoutingModule { }
