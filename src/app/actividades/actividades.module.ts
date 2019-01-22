import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActividadesRoutingModule } from './actividades-routing.module';
import { ActividadNuevaComponent } from './actividad/actividad-nueva/actividad-nueva.component';
import { ActividadesComponent } from './actividades.component';
import { TrabajadoresDialogComponent } from './trabajador/trabajadores-dialog/trabajadores-dialog.component';
import { AppMaterialModule } from '../app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TemplateModule } from '../template/template.module';
import { ActividadListarComponent } from './actividad/actividad-listar/actividad-listar.component';
import { ActividadMostrarComponent } from './actividad/actividad-mostrar/actividad-mostrar.component';
import { ActividadEditarComponent } from './actividad/actividad-editar/actividad-editar.component';

@NgModule({
  declarations: [
    ActividadesComponent,
    ActividadNuevaComponent,
    TrabajadoresDialogComponent,
    ActividadListarComponent,
    ActividadMostrarComponent,
    ActividadEditarComponent,
    // SumaPorcientoValidatorDirective, 
  ],
  imports: [
    CommonModule,
    ActividadesRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    TemplateModule
  ],
  entryComponents:[
    TrabajadoresDialogComponent
  ]
})
export class ActividadesModule { }
