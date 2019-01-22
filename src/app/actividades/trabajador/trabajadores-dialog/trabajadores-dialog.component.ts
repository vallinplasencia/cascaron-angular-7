import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy } from '@angular/core';
import { Trabajador } from '../../../acceso-datos/models/trabajador';
import { MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Subscription, Subject, merge } from 'rxjs';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { Router } from '@angular/router';
import { Valores } from '../../../util/valores';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TrabajadorService } from '../../../acceso-datos/repos/trabajador.service';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Util } from '../../../util/util';

@Component({
  selector: 'app-trabajadores-dialog',
  templateUrl: './trabajadores-dialog.component.html',
  styleUrls: ['./trabajadores-dialog.component.css']
})
export class TrabajadoresDialogComponent implements OnInit, OnDestroy {

  //Propiedades relacionadas con la tabla
  columnas: string[] = ['numero', 'nombre', 'accion'];
  data: Trabajador[] = [];
  isLoadingResults = false;
  opcsPageSize: number[];
  totalItems: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  ocurrioError: boolean = false;
  
  //Hace q se cancele la peticion de recuperar los datos cuando se navega a otra url desde la url actual. 
  private subscripResp: Subscription = null;
  private subscripFiltrar: Subscription = null;

  //Subject q emite cuando se presione el btn refrescar
  private filtarTermino = new Subject<string>();

  constructor(
    private dialogRef: MatDialogRef<TrabajadoresDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private datos: {itemData: ItemData<Trabajador[] | Errorr>},
    private trabajadorRepo: TrabajadorService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.opcsPageSize = Valores.OPCS_PAG_SIZE;
  }
  
  public ngOnInit() {
    switch (this.datos.itemData.codigo) {
      case CodigoApp.OK: {
        this.ocurrioError = false;
        this.totalItems = this.datos.itemData.meta.total;
        this.data = this.datos.itemData.data as Trabajador[];
        break;
      }
      default: {
        this.manejoError(this.datos.itemData.codigo, this.datos.itemData as ItemData<Errorr>)
      }
    }
  }

  public ngAfterViewInit(): void {
    // Si se cambia el orden se regresa a la primera pagina de la tabla.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.subscripResp = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        // startWith({}),
        switchMap(() => {
          this.data = [];
          this.totalItems = 0;
          this.ocurrioError = false;
          this.isLoadingResults = true;

          return this.trabajadorRepo!.index(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
            this.input.nativeElement.value);
        }),
    ).subscribe(data => this.onSubscribe(data));

    this.subscripFiltrar = this.filtarTermino
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term: string) => {
          this.isLoadingResults = true;
          this.ocurrioError = false;
          this.snackBar.dismiss();

          this.data = [];
          this.totalItems = 0;
          this.paginator.pageIndex = 0;
          return this.trabajadorRepo!.index(
            0,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
            this.input.nativeElement.value);
        }),
    ).subscribe(data => { this.onSubscribe(data) });

  }

  public ngOnDestroy(): void {
    if(this.subscripFiltrar){
      this.subscripFiltrar.unsubscribe();
    }
    if(this.subscripResp){
      this.subscripResp.unsubscribe();
    }
    if (this.ocurrioError) {
      this.snackBar.dismiss();
    }
  }

  /**
   * Metodo q se llama cuando se presiona una tecla en el input q filtra los datos de la tabla.
   * Emite el texto q hay en el INPUT. Hace q se ejecute una nueva llamada a los datos desde el servidor. 
   * @param cadena 
   */
  filtrar(cadena: string) {
    this.filtarTermino.next(cadena);
  }

  limpiarFiltro(eleFiltro: HTMLInputElement) {
    eleFiltro.value = '';
    this.filtrar('');
  }

  /**
   * Metodo que se llama cada vez q hay un cambio en los datos a mostrar en la tabla.
   * Llenando la fuente de datos de la tabla y manejando posibles errores q puedan ocurrir
   * @param data 
   */
  private onSubscribe(data: ItemData<Trabajador[] | Errorr>) {    
    this.isLoadingResults = false;
    
    switch (data.codigo) {
      case CodigoApp.OK: {
        this.ocurrioError = false;
        this.totalItems = data.meta.total;
        let trabajadores = data.data as Trabajador[];

        if (!trabajadores.length && this.totalItems) {
          //Si en la pagina actual de la tabla no tiene trabajadores pero hay paginas anteriores.Navego a la anterior 
          this.paginator.previousPage();
        } else {
          this.data = data.data as Trabajador[];
        }
        break;
      }
      default: {
        this.manejoError(data.codigo, data as ItemData<Errorr>)
      }
    }
  }

  /**
   * Funcion q maneja los errores q se producen al hacer una peticion http.
   * @param codigo Codigo de la App segun el resultado de la respuesta http.
   * @param dataError El ItemData<Error> con la informacion del problema.
   */
  private manejoError(codigo: number, dataError: ItemData<Errorr>) {
    this.data = [];
    this.totalItems = 0;
    this.ocurrioError = true;
    this.paginator.pageIndex = 0;

    let err = dataError.data as Errorr;
    let todosErrores = "";

    for(let key in err){
      todosErrores += `${key.toUpperCase()}: ${err[key].join(', ')}.`;
    }
    const msj = `${todosErrores} Código de error de la app: ${dataError.codigo}`;
    let tituloMsj = "Ocurrió un problema. Inténtelo mas tarde.";

    if (dataError.codigo == CodigoApp.ERROR_UNAUTHORIZED) {
      this.router.navigate([{ outlets: { primary: null, sidebar: null } }]);
      tituloMsj = 'Sin autorización.';
      this.dialogRef.close();
    }
    setTimeout(() => {
      this.snackBar.openFromComponent(SnackbarErrorComponent, {
        data: [tituloMsj, msj],
        duration: Util.SNACKBAR_DURACION_ERROR,
      });
    });
  }

}
