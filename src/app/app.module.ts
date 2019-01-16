import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*INI Importando Idioma Espanol para el Pipe Date */
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-CU';
registerLocaleData(localeEs);
/*FIN Importando Idioma Espanol para el Pipe Date */

import { HttpClientModule } from '@angular/common/http';

import { NgProgressModule } from '@ngx-progressbar/core';

import { TemplateModule } from './template/template.module';
import { httpInterceptorProviders } from './util/http-interceptors';
import { AuthService } from './acceso-datos/seguridad/auth.service';
import { SeguridadModule } from './seguridad/seguridad.module';
import { ComprobarComponent } from './comprobar/comprobar.component';
// import { LoginComponent } from './seguridad/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    ComprobarComponent,
    // LoginComponent,
  ],
  imports: [
    BrowserModule,

    //Orden de los modulos para cargar las rutas es importante
    //Se pone primero AppRoutinModule
    SeguridadModule,

    AppRoutingModule,

    BrowserAnimationsModule,

    HttpClientModule,
    NgProgressModule.forRoot(),
    
    TemplateModule,
   
  ],
  providers: [
    AuthService,
    httpInterceptorProviders 
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
