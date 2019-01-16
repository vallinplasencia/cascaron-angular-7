import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Subscription, Subject, merge, Observable } from 'rxjs';
import { ActivoService } from '../../../acceso-datos/repos/activo.service';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { NgProgress } from '@ngx-progressbar/core';
import { Valores } from '../../../util/valores';
import { startWith, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarOkComponent } from '../../../template/snackbar/snackbar-ok/snackbar-ok.component';
import { Util } from '../../../util/util';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Urls } from '../../../acceso-datos/util/urls';
import { Activo } from '../../../acceso-datos/models/activo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activo-listar',
  templateUrl: './activo-listar.component.html',
  styleUrls: ['./activo-listar.component.css']
})
export class ActivoListarComponent implements OnInit, AfterViewInit {

  //Propiedades relacionadas con la tabla
  columnas: string[] = ['numero', 'nombre', 'categoria', 'esPrincipal', 'fechaAlta', 'fechaBaja', 'responsable', 'unidades', 'acciones'];
  data: Activo[] = [];
  isLoadingResults = true;
  opcsPageSize: number[];
  totalItems: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  ocurrioError: boolean = false;
  eliminando: boolean = false;
  //Nombre q se muestra al usuario cuando se va a eliminar una fila.
  activoAEliminar = null;

  //Hace q se cancele la peticion de recuperar los datos cuando se navega a otra url desde la url actual. 
  private subscriptionActivos: Subscription = null;
  private subscriptionEliminar: Subscription = null;
  private subscriptionActivosRefresh: Subscription = null;
  private subscriptionFiltrar: Subscription = null;

  //Subject q emite cuando se presione el btn refrescar
  private refrescarClick = new Subject();
  private filtarTermino = new Subject<string>();

  constructor(
    private router: Router,
    private activoRepo: ActivoService,
    private dialogConfigm: DialogConfirmSimpleService,
    private snackBar: MatSnackBar,
    private progress: NgProgress
  ) {
    this.opcsPageSize = Valores.OPCS_PAG_SIZE;
    this.totalItems = 0;
  }

  public ngOnInit() {
  }

  public ngAfterViewInit(): void {
    // Si se cambia el orden se regresa a la primera pagina de la tabla.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.subscriptionActivos = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.data = [];
          this.totalItems = 0;
          this.eliminando = false;
          this.ocurrioError = false;
          this.isLoadingResults = true;
          this.activoAEliminar = null;

          return this.activoRepo!.index(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.nombCampoOrdenarUrl(this.sort.active),
            this.sort.direction,
            this.input.nativeElement.value);
        }),
    ).subscribe(data => this.onSubscribe(data));

    this.subscriptionActivosRefresh = this.refrescarClick
      .pipe(
        switchMap(() => {
          this.isLoadingResults = true;
          return this.activoRepo!.index(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.nombCampoOrdenarUrl(this.sort.active),
            this.sort.direction,
            this.input.nativeElement.value);
        })
      ).subscribe((data) => {
        this.onSubscribe(data);
      });


    this.subscriptionFiltrar = this.filtarTermino
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
          return this.activoRepo!.index(
            0,
            this.paginator.pageSize,
            this.nombCampoOrdenarUrl(this.sort.active),
            this.sort.direction,
            this.input.nativeElement.value);
        }),
    ).subscribe(data => { this.onSubscribe(data) });

  }

  /**
   * Metodo q se llama cuando se presiona el boton refrescar.
   * Emite un valor vacio. Hace q se ejecute una nueva llamada a los datos desde el servidor. 
   * @param event 
   */
  refrescar(event) {
    event.preventDefault();
    this.ocurrioError = false;
    this.snackBar.dismiss();

    this.data = [];
    this.totalItems = 0;
    this.refrescarClick.next();
  }

  /**
   * Metodo q se llama cuando se presiona una tecla en el input q filtra los datos de la tabla.
   * Emite el texto q hay en el INPUT. Hace q se ejecute una nueva llamada a los datos desde el servidor. 
   * @param cadena 
   */
  filtrar(cadena: string) {
    this.filtarTermino.next(cadena);
  }

  /**
   * Metodo que se llama cada vez q hay un cambio en los datos a mostrar en la tabla.
   * Llenando la fuente de datos de la tabla y manejando posibles errores q puedan ocurrir
   * @param data 
   */
  private onSubscribe(data: ItemData<Activo[] | Errorr>) {

    this.eliminando = false;
    this.isLoadingResults = false;
    this.activoAEliminar = null;


    switch (data.codigo) {
      case CodigoApp.OK: {
        this.ocurrioError = false;
        this.totalItems = data.meta.total;
        let activos = data.data as Activo[];

        if (!activos.length && this.totalItems) {
          //Si en la pagina actual de la tabla no tiene activos pero hay paginas anteriores.Navego a la anterior 
          this.paginator.previousPage();
        } else {
          this.data = data.data as Activo[];
        }
        break;
      }
      default: {
        this.manejoError(data.codigo, data as ItemData<Errorr>)
      }
    }
  }

  confirmarEliminacion(event, id: number | string, activo: string) {
    event.preventDefault();
    this.dialogConfigm.confirm("Se eliminará permanentemente el activo: " + activo.toUpperCase() + ".\nDesea eliminarlo de todos modos?.")
      .subscribe((rta) => {
        if (rta) {
          this.activoAEliminar = activo;

          this.eliminar(id);
        }
      });
  }

  private eliminar(id: number | string) {
    this.eliminando = true;

    this.subscriptionEliminar = this.activoRepo
      .eliminar(id)
      .subscribe((data) => {
        this.eliminando = false;

        switch (data.codigo) {

          case CodigoApp.OK: {
            this.ocurrioError = false;
            this.activoAEliminar = null;
            let act = data.data as Activo;

            let activos = this.data.filter((cc) => {
              return cc.id != act.id;
            });
            this.totalItems = this.totalItems - 1;

            if (!activos.length && this.totalItems) {
              //Si en la pagina actual de la tabla no tiene activos pero hay paginas anteriores.Navego a la anterior 
              this.paginator.previousPage();
            } else {
              this.data = activos;
            }
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ["Se eliminó correctamente el activo: ", act.nombre.toUpperCase()],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });
            break;
          }
          default: {
            this.manejoError(data.codigo, data as ItemData<Errorr>)
          }
        }
      });
  }

  cancelarEliminacion() {
    this.eliminando = false;

    // if (this.ocurrioError) {
    this.snackBar.dismiss();
    // }
    if (this.subscriptionEliminar) {
      this.subscriptionEliminar.unsubscribe();
    }
  }

  public canDeactivate(): Observable<boolean> | boolean {
    if (this.eliminando) {
      this.snackBar.open(
        'No puede abandonar esta ventana pues se está eliminando una activo. Cancele esta operación primero para navegar a otra ventana.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    if (this.subscriptionActivos) {
      this.subscriptionActivos.unsubscribe();
    }
    if (this.subscriptionActivosRefresh) {
      this.subscriptionActivosRefresh.unsubscribe();
    }
    if (this.subscriptionFiltrar) {
      this.subscriptionFiltrar.unsubscribe();
    }
    if (this.ocurrioError) {
      this.snackBar.dismiss();
    }
    return true;
  }

  limpiarFiltro(eleFiltro: HTMLInputElement) {
    eleFiltro.value = '';
    this.filtrar('');
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

    for (let key in err) {
      todosErrores += `${key.toUpperCase()}: ${err[key].join(', ')}.`;
    }
    const msj = `${todosErrores} Código de error de la app: ${dataError.codigo}`;
    let tituloMsj = "Ocurrió un problema. Inténtelo mas tarde.";

    if (dataError.codigo == CodigoApp.ERROR_UNAUTHORIZED) {
      this.router.navigate([{ outlets: { primary: null, sidebar: null } }]);
      tituloMsj = 'Sin autorización.';
    }
    setTimeout(() => {
      this.snackBar.openFromComponent(SnackbarErrorComponent, {
        data: [tituloMsj, msj],
        duration: Util.SNACKBAR_DURACION_ERROR,
      });
    });
  }

  /**
   * Retorna un string q va a ser el nombre del campo por el que se va a ordenar
   * el resultado. Este nombre es el q se va a enviar al servidor en los
   * parametros de la url.
   * @param campo 
   */
  private nombCampoOrdenarUrl(campo: string) {
    campo = campo || 'nombre';
    
    switch (campo) {
      case "responsable":
        return "responsableNombre";
      case "categoria":
        return "categoriaNombre";
      default:
        return campo;
    }
  }

  urlExport() {
    return Urls.crearUrl('exportar/activos')
    // return 'http://riesgos-backend.mii/exportar/activos'
  }
}
