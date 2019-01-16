import { Component, OnInit } from '@angular/core';
import { Activo } from '../../../acceso-datos/models/activo';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { ActivoService } from '../../../acceso-datos/repos/activo.service';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarOkComponent } from '../../../template/snackbar/snackbar-ok/snackbar-ok.component';
import { Util } from '../../../util/util';
import { Observable } from 'rxjs';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';

@Component({
  selector: 'app-activo-mostrar',
  templateUrl: './activo-mostrar.component.html',
  styleUrls: ['./activo-mostrar.component.css']
})
export class ActivoMostrarComponent implements OnInit {
  activo: Activo = null;
  eliminando: boolean = false;

  private ocurrioError: boolean = false;
  private subscriptionEliminar = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogConfirm: DialogConfirmSimpleService,
    private activoRepo: ActivoService
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: { itemData: ItemData<Activo | Errorr> }) => {

        switch (data.itemData.codigo) {
          case CodigoApp.OK: {
            this.activo = data.itemData.data as Activo;
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
    this.dialogConfirm.confirm("Se eliminará permanentemente el activo: " + this.activo.nombre.toUpperCase() + ".\nDesea eliminarlo de todos modos?.")
      .subscribe((rta) => {
        if (rta) {
          this.eliminar(this.activo.id);
        }
      });
  }
  private eliminar(id: number | string) {
    this.eliminando = true;
    this.ocurrioError = false;

    this.subscriptionEliminar = this.activoRepo
      .eliminar(id)
      .subscribe((data) => {
        this.eliminando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            this.ocurrioError = false;
            let act = data.data as Activo;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ["Se eliminó correctamente el activo: ", act.nombre.toUpperCase()],
                duration: Util.SNACKBAR_DURACION_ERROR,
              });
            });
            this.router.navigate([{ outlets: { primary: 'activos/activo', sidebar: ['activo'] } }]);
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
        'No puede abandonar esta ventana pues se está eliminando un activo. Cancele primero esta operación para navegar a otra ventana.',
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
    this.activo = null;
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
}
