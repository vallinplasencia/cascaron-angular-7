import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivoListarComponent } from './activo/activo-listar/activo-listar.component';
import { ActivosComponent } from './activos.component';
import { ActivosRoutingModule } from './activos-routing.module';
import { AppMaterialModule } from '../app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TemplateModule } from '../template/template.module';
import { ActivoMostrarComponent } from './activo/activo-mostrar/activo-mostrar.component';
import { ActivoNuevoComponent } from './activo/activo-nuevo/activo-nuevo.component';
import { ConfiguracionModule } from '../configuracion/configuracion.module';
import { ActivoEditarComponent } from './activo/activo-editar/activo-editar.component';

@NgModule({
  declarations: [
    ActivosComponent,
    ActivoListarComponent,
    ActivoMostrarComponent,
    ActivoNuevoComponent,
    ActivoEditarComponent,     
  ],
  imports: [
    CommonModule,
    ActivosRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    TemplateModule,
    ConfiguracionModule
  ],
})
export class ActivosModule { }
