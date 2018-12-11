import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionComponent } from './configuracion.component';
import { CategoriaNuevaComponent } from './categoria/categoria-nueva/categoria-nueva.component';

const routes: Routes = [
  {
    path: '',
    children: [
      //Categorias
      {
        path: 'categoria',
        component: ConfiguracionComponent,
        children: [
          // {
          //   path: '',
          //   component: CategoriaListarComponent,
          //   canDeactivate: [CanDeactivateGuard]
          // },      
          {
            path: 'nueva',
            component: CategoriaNuevaComponent,
            // canDeactivate: [CanDeactivateGuard]
          },
          // {
          //   path: 'editar/:id',
          //   component: CategoriaEditarComponent,
          //   canDeactivate: [CanDeactivateGuard],
          //   resolve: {
          //     itemData: CategoriaResolverService
          //   }
          // },
          // {
          //   path: ':id',
          //   component: CategoriaMostrarComponent,
          //   canDeactivate: [CanDeactivateGuard],
          //   resolve: {
          //     itemData: CategoriaResolverService
          //   }
          // },
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
