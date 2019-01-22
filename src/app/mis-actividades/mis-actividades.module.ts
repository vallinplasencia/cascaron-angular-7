import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisActividadesRoutingModule } from './mis-actividades-routing.module';
import { MisActividadesComponent } from './mis-actividades.component';
import { MisActividadesAsignadasListarComponent } from './mis-actividades-asignadas-listar/mis-actividades-asignadas-listar.component';
import { AppMaterialModule } from '../app-material.module';
import { MisActividadesAsignadasMostrarComponent } from './mis-actividades-asignadas-mostrar/mis-actividades-asignadas-mostrar.component';

@NgModule({
  declarations: [
    MisActividadesComponent,
    MisActividadesAsignadasListarComponent,
    MisActividadesAsignadasMostrarComponent, 
    
  ],
  imports: [
    CommonModule,
    MisActividadesRoutingModule,
    AppMaterialModule,
  ]
})
export class MisActividadesModule { }
