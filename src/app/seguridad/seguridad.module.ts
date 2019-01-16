import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AppMaterialModule } from '../app-material.module';
import { TemplateModule } from '../template/template.module';
import { LogoutComponent } from './logout/logout.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { SeguridadRoutingModule } from './seguridad-routing.module';
import { CambiarClaveComponent } from './cambiar-clave/cambiar-clave.component';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegistrarComponent,
    CambiarClaveComponent
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    ReactiveFormsModule,
    AppMaterialModule,
    TemplateModule
  ]
})
export class SeguridadModule { }
