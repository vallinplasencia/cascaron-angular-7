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

import { TemplateModule } from './template/template.module'; 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    BrowserAnimationsModule,
    
    TemplateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
