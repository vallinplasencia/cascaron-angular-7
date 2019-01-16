import { Component, OnInit } from '@angular/core';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { Subscription, Observable } from 'rxjs';
import { FormBuilder, Validators, FormGroup, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AccountService } from '../../acceso-datos/seguridad/account.service';
import { DialogConfirmSimpleService } from '../../util/services/dialog-confirm-simple.service';
import { CodigoApp } from '../../acceso-datos/util/codigo-app';
import { SnackbarOkComponent } from '../../template/snackbar/snackbar-ok/snackbar-ok.component';
import { Util } from '../../util/util';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';
import { SnackbarErrorComponent } from '../../template/snackbar/snackbar-error/snackbar-error.component';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.css']
})
export class CambiarClaveComponent implements OnInit {

  enviando: boolean = false;
  //Errores de validacion 
  errores: Errorr = null;
  ocurrioError: boolean = false;

  subscripSalvar: Subscription = null;

  cambiarClaveForm = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', 
    [
      Validators.required, Validators.maxLength(100), Validators.minLength(6),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!\.%*?&])[A-Za-z\d$@$!\.%*?&].{5,}')
    ]],
    confirmPassword: ['']
  }, { validator: this.checkIfMatchingPasswords('newPassword', 'confirmPassword') })
  
  //Maneja q se muestre el texto de la clave y clave de confirmacion
  ocultarClave = true;
  ocultarNuevaClave = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private repo: AccountService,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  ngOnInit() { }

  onSubmit(formDirective: FormGroupDirective) {
    this.errores = null;
    this.enviando = true;
    this.snackBar.dismiss();

    this.subscripSalvar = this.repo
      .cambiarClave(this.cambiarClaveForm.value)
      .subscribe(data => {
        this.enviando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            this.errores = null;
            this.ocurrioError = false;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ['Se cambió correctamente su clave.', ""],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            formDirective.resetForm();
            this.cambiarClaveForm.reset();
            this.router.navigate([{ outlets: { primary: null, sidebar: null } }]);
            
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
   * Retorna el campo oldPassword(FormControl)
   */
  get oldPassword() {
    return this.cambiarClaveForm.get('oldPassword');
  }

  /**
   * Retorna el campo newPassword(FormControl)
   */
  get newPassword() {
    return this.cambiarClaveForm.get('newPassword');
  }

  
  /**
   * Retorna el campo confirm password(FormControl)
   */
  get confirmPassword() {
    return this.cambiarClaveForm.get('confirmPassword');
  }

  /**
   * Retorna el mensaje de error asociado con el campo q no cumpla las reglas de validacion
   */
  getErrorMessage(campo: string) {

    switch (campo) {
      case 'oldPassword': {
        if (this.oldPassword.hasError('required')) {
          return 'Proporcione la clave actual.';
        }
        break
      }
      case 'newPassword': {
        if (this.newPassword.hasError('required')) {
          return 'Proporcione un clave.';
        }
        if (this.newPassword.hasError('maxlength') || this.newPassword.hasError('minlength')) {
          return 'La clave tiene que tener entre 6 y 100 caracteres.';
        }
        if (this.newPassword.hasError('pattern')) {
          return 'La clave tiene que iniciar con una letra y formada como mínimo por una letra minúscula, una miyúscula, un número y alguno de estos caracteres: .$@$!%*?&.';
        }
        break;
      }
      case 'confirmPassword': {
        if (this.confirmPassword.hasError('notEquivalent')) {
          return 'La clave y la clave de confirmación no coinciden.';
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
        'No puede abandonar esta página mientras se está guardando información. Cancele esta operación primero para navegar a otra página.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    if (this.hayCambiosForm()) {
      return this.dialogConfirm.confirm("Si continua se perderán los cambios.\nDesea continuar?");
    }
    return true;
  }

  cancelarEnvio() {
    this.enviando = false;

    // if (this.ocurrioError) {
      this.snackBar.dismiss();
    // }
    if (this.subscripSalvar) {
      this.subscripSalvar.unsubscribe();
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

    for(let key in err){
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
   * Varifica q dos campos contengan el mismo valor.
   * Se le pasan por parametros las claves de los campos a comprobar.
   * En este caso se le pasaran las claves de los campos newPassword y conformPassword 
   * @param passwordKey 
   * @param passwordConfirmationKey 
   */
  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  /**
   * Retorna TRUE si se han realizados cambios en el formulario
   */
  private hayCambiosForm() {
    return (this.oldPassword.value ||
      this.newPassword.value ||
      this.confirmPassword.value
    );
  }

}
