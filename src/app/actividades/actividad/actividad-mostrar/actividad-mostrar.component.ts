import { Component, OnInit } from '@angular/core';
import { ActividadService } from '../../../acceso-datos/repos/actividad.service';
import { Actividad } from '../../../acceso-datos/models/actividad';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarOkComponent } from '../../../template/snackbar/snackbar-ok/snackbar-ok.component';
import { Util } from '../../../util/util';
import { Observable } from 'rxjs';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { EstadosActividad } from '../../../acceso-datos/util/estados-actividad.enum';

@Component({
  selector: 'app-actividad-mostrar',
  templateUrl: './actividad-mostrar.component.html',
  styleUrls: ['./actividad-mostrar.component.css']
})
export class ActividadMostrarComponent implements OnInit {
actividad: Actividad = null;
  eliminando: boolean = false;

  private ocurrioError: boolean = false;
  private subscriptionEliminar = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogConfirm: DialogConfirmSimpleService,
    private actividadRepo: ActividadService
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: { itemData: ItemData<Actividad | Errorr> }) => {

        switch (data.itemData.codigo) {
          case CodigoApp.OK: {
            this.actividad = data.itemData.data as Actividad;
            break;
          }
          default: {
            this.manejoError(data.itemData.codigo, data.itemData as ItemData<Errorr>)
          }
        }
      });
  }

  confirmarEliminacion() {

    this.snackBar.dismiss();
    this.dialogConfirm.confirm("Se eliminará permanentemente la actividad: " + this.actividad.titulo.toUpperCase() + ".\nDesea eliminarla de todos modos?.")
      .subscribe((rta) => {
        if (rta) {
          this.eliminar(this.actividad.id);
        }
      });
  }
  private eliminar(id: number | string) {
    this.eliminando = true;
    this.ocurrioError = false;

    this.subscriptionEliminar = this.actividadRepo
      .eliminar(id)
      .subscribe((data) => {
        this.eliminando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            this.ocurrioError = false;
            let act = data.data as Actividad;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ["Se eliminó correctamente la actividad: ", act.titulo.toUpperCase()],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });
            this.router.navigate([{ outlets: { primary: 'actividades/actividad', sidebar: ['actividad'] } }]);
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
    this.snackBar.dismiss();

    if (this.subscriptionEliminar) {
      this.subscriptionEliminar.unsubscribe();
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.ocurrioError) {
      this.snackBar.dismiss();
    }
    if (this.eliminando) {
      this.snackBar.open(
        'No puede abandonar esta ventana pues se está eliminando un actividad. Cancele primero esta operación para navegar a otra ventana.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    return true;
  }

  /**
   * Funcion q maneja los errores q se producen al hacer una peticion http.
   * @param codigo Codigo de la App segun el resultado de la respuesta http.
   * @param dataError El ItemData<Error> con la informacion del problema.
   */
  private manejoError(codigo: number, dataError: ItemData<Errorr>) {
    this.actividad = null;
    this.ocurrioError = true;

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
