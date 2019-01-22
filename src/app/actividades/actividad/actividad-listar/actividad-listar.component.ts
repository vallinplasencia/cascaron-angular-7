import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Actividad } from '../../../acceso-datos/models/actividad';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Subscription, Subject, merge, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ActividadService } from '../../../acceso-datos/repos/actividad.service';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { Valores } from '../../../util/valores';
import { startWith, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarOkComponent } from '../../../template/snackbar/snackbar-ok/snackbar-ok.component';
import { Util } from '../../../util/util';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EstadosActividad } from '../../../acceso-datos/util/estados-actividad.enum';

@Component({
  selector: 'app-actividad-listar',
  templateUrl: './actividad-listar.component.html',
  styleUrls: ['./actividad-listar.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ActividadListarComponent implements OnInit , AfterViewInit {

  //Propiedades relacionadas con la tabla
  columnas: string[] = ['numero', 'titulo', 'estado', 'fechaRegistro', 'creada', 'asignada', 'descripcion', 'acciones'];
  data: Actividad[] = [];
  isLoadingResults = true;
  opcsPageSize: number[];
  totalItems: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  expandedElement: any | null;


  ocurrioError: boolean = false;
  eliminando: boolean = false;
  //Nombre q se muestra al usuario cuando se va a eliminar una fila.
  actividadAEliminar = null;

  //Hace q se cancele la peticion de recuperar los datos cuando se navega a otra url desde la url actual. 
  private subscriptionActividad: Subscription = null;
  private subscriptionEliminar: Subscription = null;
  private subscriptionActividadRefresh: Subscription = null;
  private subscriptionFiltrar: Subscription = null;

  //Subject q emite cuando se presione el btn refrescar
  private refrescarClick = new Subject();
  private filtarTermino = new Subject<string>();

  constructor(
    private router: Router,
    private actividadRepo: ActividadService,
    private dialogConfigm: DialogConfirmSimpleService,
    private snackBar: MatSnackBar
  ) {
    this.opcsPageSize = Valores.OPCS_PAG_SIZE;
    this.totalItems = 0;
  }

  public ngOnInit() {
  }

  public ngAfterViewInit(): void {
    // Si se cambia el orden se regresa a la primera pagina de la tabla.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.subscriptionActividad = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.data = [];
          this.totalItems = 0;
          this.eliminando = false;
          this.ocurrioError = false;
          this.isLoadingResults = true;
          this.actividadAEliminar = null;

          return this.actividadRepo!.index(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.nombCampoOrdenarUrl(this.sort.active),
            this.sort.direction,
            this.input.nativeElement.value);
        }),
    ).subscribe(data => this.onSubscribe(data));

    this.subscriptionActividadRefresh = this.refrescarClick
      .pipe(
        switchMap(() => {
          this.isLoadingResults = true;
          return this.actividadRepo!.index(
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
          return this.actividadRepo!.index(
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
  private onSubscribe(data: ItemData<Actividad[] | Errorr>) {

    this.eliminando = false;
    this.isLoadingResults = false;
    this.actividadAEliminar = null;


    switch (data.codigo) {
      case CodigoApp.OK: {
        this.ocurrioError = false;
        this.totalItems = data.meta.total;
        let actividades = data.data as Actividad[];

        if (!actividades.length && this.totalItems) {
          //Si en la pagina actual de la tabla no tiene actividades pero hay paginas anteriores.Navego a la anterior 
          this.paginator.previousPage();
        } else {
          let datos = data.data as Actividad[];
          datos.forEach((a,idx)=>{a.posicion = idx+1})
          this.data = datos;
        }
        break;
      }
      default: {
        this.manejoError(data.codigo, data as ItemData<Errorr>)
      }
    }
  }

  confirmarEliminacion(event, id: number | string, actividad: string) {
    event.preventDefault();
    event.stopPropagation();
    this.dialogConfigm.confirm("Se eliminará permanentemente la actividad: " + actividad.toUpperCase() + ".\nDesea eliminarla de todos modos?.")
      .subscribe((rta) => {
        if (rta) {
          this.actividadAEliminar = actividad;

          this.eliminar(id);
        }
      });
  }

  private eliminar(id: number | string) {
    this.eliminando = true;

    this.subscriptionEliminar = this.actividadRepo
      .eliminar(id)
      .subscribe((data) => {
        this.eliminando = false;

        switch (data.codigo) {

          case CodigoApp.OK: {
            this.ocurrioError = false;
            this.actividadAEliminar = null;
            let act = data.data as Actividad;

            let actividades = this.data.filter((cc) => {
              return cc.id != act.id;
            });
            this.totalItems = this.totalItems - 1;

            if (!actividades.length && this.totalItems) {
              //Si en la pagina actual de la tabla no tiene actividades pero hay paginas anteriores.Navego a la anterior 
              this.paginator.previousPage();
            } else {
              this.data = actividades;
            }
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ["Se eliminó correctamente la actividad: ", act.titulo.toUpperCase()],
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
        'No puede abandonar esta ventana pues se está eliminando una actividad. Cancele esta operación primero para navegar a otra ventana.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    if (this.subscriptionActividad) {
      this.subscriptionActividad.unsubscribe();
    }
    if (this.subscriptionActividadRefresh) {
      this.subscriptionActividadRefresh.unsubscribe();
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
    campo = campo || 'titulo';
    
    switch (campo) {
      case "creada":
      return "creadaPorNombre";
      case "asignada":
        return "asignadaANombre";
      default:
        return campo;
    }
  }

  /**
   * Retorna el estado tipo texto pasandole por parametro el numero del texto.
   * @param idxEstado 
   */
  estadoTexto(idxEstado: number){
    return EstadosActividad[idxEstado];
  }

  /**
   * Retorna una Objeto con las clases a aplicar al estado de la activida
   * @param estadoNum estado de la actividad
   */
  estilosEstado(estadoNum: number){
    return {
      "badge": true,
      "badge-primary": estadoNum == 1,
      "badge-success": estadoNum == 2,
      "badge-danger": estadoNum == 3, 
    }
  }

}

