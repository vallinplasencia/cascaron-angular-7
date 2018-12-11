import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { CategoriaNuevaComponent } from './categoria/categoria-nueva/categoria-nueva.component';
import { ConfiguracionComponent } from './configuracion.component';

@NgModule({
  declarations: [
    CategoriaNuevaComponent, 
    ConfiguracionComponent
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule
  ]
})
export class ConfiguracionModule { }
