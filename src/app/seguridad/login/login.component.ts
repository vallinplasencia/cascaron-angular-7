import { Component, OnInit } from '@angular/core';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../acceso-datos/seguridad/auth.service';
import { CodigoApp } from '../../acceso-datos/util/codigo-app';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';
import { Util } from '../../util/util';
import { SnackbarErrorComponent } from '../../template/snackbar/snackbar-error/snackbar-error.component';
import { UsuarioAuth } from '../../acceso-datos/util/entidades/usuario-auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  enviando: boolean = false;
  //Errores de validacion 
  errores: Errorr = null;
  ocurrioError: boolean = false;

  subscripLogin: Subscription = null;

  loginForm = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    clave: new FormControl(''),
    guardarCredenciales: new FormControl(false),
  });

  ocultarClave = true;


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private repo: AuthService
  ) { }

  ngOnInit() { }

  onSubmit(formDirective: FormGroupDirective) {
    this.errores = null;
    this.enviando = true;
    this.snackBar.dismiss();

    this.subscripLogin = this.repo
      .login(this.usuario.value, this.clave.value)
      .subscribe(data => {
        this.enviando = false;
        switch (data.codigo) {
          case CodigoApp.OK: {
            localStorage.setItem(Util.STORAGE_GUARDAR_CREDENCIALES, this.guardarCredenciales.value? "1":"")
            //Guardo los datos del usuario logueado incluyendo el token
            this.repo.salvarUsuarioAuth(data.data as UsuarioAuth)
            this.errores = null;
            this.ocurrioError = false;
            
            // const redireccUrl = this.repo.redireccionarUrl ? this.repo.redireccionarUrl: '';
            // this.router.navigate([redireccUrl]);
            // this.repo.redireccionarUrl = null;
            // // this.router.navigate([{ outlets: { primary: 'configuracion/categoria', sidebar: ['configuracion'] } }]);

            

            // this.router.navigate(['/']);
            this.router.navigate([{ outlets: { primary: null, sidebar: null } }]);

            break;
          }
          case CodigoApp.ERROR_AUTENTICACION_FALLA:
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
   * Retorna el campo usuario(FormControl)
   */
  get usuario() {
    return this.loginForm.get('usuario');
  }

  /**
   * Retorna el campo clave(FormControl)
   */
  get clave() {
    return this.loginForm.get('clave');
  }

  /**
   * Retorna el campo Guardar Credenciales(FormControl)
   */
  get guardarCredenciales() {
    return this.loginForm.get('guardarCredenciales');
  }

  /**
   * Retorna el mensaje de error asociado con el campo q no cumpla las reglas de validacion
   */
  getErrorMessage(campo: string) {

    switch (campo) {
      case 'usuario': {
        if (this.usuario.hasError('required')) {
          return 'Proporcione el nombre de usuario.';
        }
        break;
      }
    }
  }

  /**
   * Metodo q se va a llamar cuando se intente abandonar la url actual.
   * Este metodo se llama a traves de el Guard Deactivate (util/guards/CanDeactivate)
   * 
   * @returns True abandona la ruta actual hacia la proxima 
   * ruta sino (False) se mantine en la ruta actual.
   */
  canDeactivate(): Observable<boolean> | boolean {
    if (this.ocurrioError) {
      this.snackBar.dismiss();
    }
    if (this.enviando) {
      this.snackBar.open(
        'No puede abandonar esta página mientras se está autenticando. Cancele esta operación primero para navegar a otra página.',
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
