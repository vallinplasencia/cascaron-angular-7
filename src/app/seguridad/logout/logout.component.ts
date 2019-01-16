import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../acceso-datos/seguridad/auth.service';
import { CodigoApp } from '../../acceso-datos/util/codigo-app';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';
import { Util } from '../../util/util';
import { SnackbarErrorComponent } from '../../template/snackbar/snackbar-error/snackbar-error.component';
import { SnackbarOkComponent } from '../../template/snackbar/snackbar-ok/snackbar-ok.component';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit, AfterViewInit {

  enviando: boolean = true;
  //Errores de validacion 
  errores: Errorr = null;
  ocurrioError: boolean = false;

  nombreUsuario: string = null;

  subscripLogin: Subscription = null;

  //Es TRUE cuando se cancela la peticion de salir de la pagina.
  cancelarLogout = false;


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private repo: AuthService
  ) { }

  ngOnInit() {
    this.nombreUsuario = this.repo.getNombreUsuario();
  }

  ngAfterViewInit(): void {
    this.logout();
  }

  /**
   * Metodo q se va a llamar cuando se intente abandonar la url actual.
   * Este metodo se llama a traves de el Guard Deactivate (util/guards/CanDeactivate)
   * 
   * @returns True abandona la ruta actual hacia la proxima 
   * ruta sino (False) se mantine en la ruta actual.
   */
  canDeactivate(): Observable<boolean> | boolean {
    // if (this.ocurrioError) {
    this.snackBar.dismiss();
    // }
    if (this.enviando) {
      this.snackBar.open(
        'No puede abandonar esta página mientras se está deslogueando. Cancele esta operación primero para navegar a otra página.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    return true;
  }

  cancelarEnvio() {
    this.enviando = false;
    this.snackBar.dismiss();
    if (this.subscripLogin) {
      this.subscripLogin.unsubscribe();
    }
    this.cancelarLogout = true;
    this.router.navigate([{ outlets: { primary: null, sidebar: null } }]);
  }

  private logout() {
    this.errores = null;
    this.enviando = true;
    this.snackBar.dismiss();
    this.cancelarLogout = false;

    this.subscripLogin = this.repo
      .logout()
      .subscribe(data => {
        // console.log('usua:', data);
        this.enviando = false;
        switch (data.codigo) {
          case CodigoApp.OK: {

            this.errores = null;
            this.ocurrioError = false;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ['Se deslogueo correctamente el usuario:', this.nombreUsuario],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            //Elimina los datos del usuario q estaba autenticado inluyendo el token
            this.repo.removerUsuarioAuth();

            // this.router.navigate(['/']);

            break;
          }
          case CodigoApp.ERROR_VALIDACION: {
            this.errores = data.data as Errorr;
            this.ocurrioError = false; //False pq errores de validacion no entra en errores generales 
            break;
          }

          default: {
            this.manejoError(data.codigo, data as ItemData<Errorr>);
            break;
          }
        }
      });
  }


  /**
   * Funcion q maneja los errores q se producen al hacer una peticion http.
   * @param codigo Codigo de la App segun el resultado de la respuesta http.
   * @param dataError El ItemData<Error> con la informacion del problema.
   */
  private manejoError(codigo: number, dataError: ItemData<Errorr>) {
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
