import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { CategoriaNuevaComponent } from './categoria/categoria-nueva/categoria-nueva.component';
import { ConfiguracionComponent } from './configuracion.component';
import { CategoriaListarComponent } from './categoria/categoria-listar/categoria-listar.component';
import { AppMaterialModule } from '../app-material.module';
import { CategoriaMostrarComponent } from './categoria/categoria-mostrar/categoria-mostrar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TemplateModule } from '../template/template.module';
import { CategoriaEditarComponent } from './categoria/categoria-editar/categoria-editar.component';
import { ResponsablesDialogComponent } from './responsable/responsables-dialog/responsables-dialog.component';

@NgModule({
  declarations: [
    CategoriaNuevaComponent, 
    ConfiguracionComponent, 
    CategoriaListarComponent, 
    CategoriaMostrarComponent, 
    CategoriaEditarComponent, 
    ResponsablesDialogComponent,
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    TemplateModule
  ],
  exports:[
    ResponsablesDialogComponent 
  ],
  entryComponents:[
    ResponsablesDialogComponent
  ]
})
export class ConfiguracionModule { }
