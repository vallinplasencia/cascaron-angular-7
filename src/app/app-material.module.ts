import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
//Moment
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
//FIN Moment
import {
  MatToolbarModule, 
  MatButtonModule, 
  MatSidenavModule,  
  MatListModule,

  MatSnackBarModule,

  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatIconModule,
  MatCheckboxModule,

  MatDialogModule,
  
  MatDatepickerModule,

  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatProgressSpinnerModule,
  //Moment
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  MatMenuModule,
  //Fin Moment

} from '@angular/material';


@NgModule({
  declarations: [],
  imports: [
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,

    MatSnackBarModule,

    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,

    MatDialogModule,

    MatDatepickerModule,

    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,

    MatMenuModule,
  ],
  exports:[
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,

    MatSnackBarModule,

    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,

    MatDialogModule,

    MatDatepickerModule,

    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,

    MatMenuModule,
  ],
  providers: [
    //Provider de moment

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },//dd-mm-yyyyFormato de fecha de Material DatePicker

    //FIN Provider de moment
  ],
})
export class AppMaterialModule { }
