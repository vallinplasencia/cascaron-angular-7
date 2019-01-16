import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Usuario } from '../../acceso-datos/models/usuario';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { Subscription, Observable } from 'rxjs';
import { Validators, FormGroupDirective, FormBuilder, FormGroup, FormControl, NgForm, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, ErrorStateMatcher, MatCheckbox } from '@angular/material';
import { AccountService } from '../../acceso-datos/seguridad/account.service';
import { DialogConfirmSimpleService } from '../../util/services/dialog-confirm-simple.service';
import { CodigoApp } from '../../acceso-datos/util/codigo-app';
import { SnackbarOkComponent } from '../../template/snackbar/snackbar-ok/snackbar-ok.component';
import { Util } from '../../util/util';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';
import { SnackbarErrorComponent } from '../../template/snackbar/snackbar-error/snackbar-error.component';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  accion = 'salvar';
  enviando: boolean = false;
  //Errores de validacion 
  errores: Errorr = null;
  ocurrioError: boolean = false;

  //Arreglo de roles que se le pueden asignar a un usuario.
  rolesCadena: string[] = [];

  //Contiene todos los mat-checkbox relacionados con los roles.
  //Esto se usa para poder unchecked pues ellos no estan ligados directamente
  //al formulario registerForm pues se carga dinamicamente/
  @ViewChildren(MatCheckbox) private rolesCheckbox : QueryList<MatCheckbox>;

  subscripSalvar: Subscription = null;

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password: ['', 
    [
      Validators.required, Validators.maxLength(100), Validators.minLength(6),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!\.%*?&])[A-Za-z\d$@$!\.%*?&].{5,}')

    ]],
    confirmPassword: [''],
    roles: this.fb.array([], Validators.required)
  }, { validator: this.checkIfMatchingPasswords('password', 'confirmPassword') });

  //Maneja q se muestre el texto de la clave y clave de confirmacion
  ocultarClave = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private repo: AccountService,
    private route: ActivatedRoute,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  ngOnInit() {
    //Obtengo los datos del resolver
    this.route.data
      .subscribe((data: { itemData: ItemData<string[] | Errorr> }) => {
        switch (data.itemData.codigo) {
          case CodigoApp.OK: {
            this.rolesCadena = data.itemData.data as string[];
            break;
          }
          default: {
            this.manejoError(data.itemData.codigo, data.itemData as ItemData<Errorr>)
          }
        }
      });
  }

  onSubmit(formDirective: FormGroupDirective) {
    this.errores = null;
    this.enviando = true;
    this.snackBar.dismiss();
    //Quito los roles del formulario del tamplate. 
    //hay q volverlos a mostrar cuando se complete la peticion
    // this.rolesCadena = [];

    this.subscripSalvar = this.repo
      .salvar(this.registerForm.value)
      .subscribe(data => {
        this.enviando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            this.vaciarRolesForm();

            let categ = data.data as Usuario;
            this.errores = null;
            this.ocurrioError = false;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ['Se registró correctamente el usuario:', categ.email],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            formDirective.resetForm();
            this.registerForm.reset();

            if (this.accion == 'salvar') {
              this.router.navigate([{ outlets: { primary: null, sidebar: null } }]);
            }
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
   * Retorna el campo email(FormControl)
   */
  get email() {
    return this.registerForm.get('email');
  }

  /**
   * Retorna el campo password(FormControl)
   */
  get password() {
    return this.registerForm.get('password');
  }

  /**
   * Retorna el campo roles en forma de arreglo(FormArray[FormControl])
   */
  get roles() {
    return this.registerForm.get('roles') as FormArray;
  }

  /**
   * Retorna el campo confirm password(FormControl)
   */
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  /**
   * Agrega un nuevo FormControl al FormArray de roles
   * @param role 
   */
  agregarControlRole(role: string) {
    this.roles.push(this.fb.control(role));
  }

  /**
   * En los roles del formulario elimina el FormControl segun el valor que tiene 
   * en el VALUE del FormArray de roles
   * @param valorControl value del control a eliminar
   */
  removerControlRole(valorControl: string) {
    const i = this.roles.controls.findIndex(control => control.value === valorControl);
    this.roles.removeAt(i);
  }

  /**
   * Limpia todos los roles seleccionados q estan almacenados
   * en el registerForm.
   * Tambien UNCHECKED los mat-checkbock de los roles en el template.
   */
  vaciarRolesForm() {
    //Elimina los roles seleccionados en el formulario registerForm
    var controlesRole = this.roles.controls;
    while (controlesRole.length > 0) {
      this.roles.removeAt(0);
    }
    //Deselecciona los mat-checkbox en el template
    this.rolesCheckbox.forEach(itemCheck=>{
      itemCheck.checked = false;
    })
  }

  /**
   * Se ejecuta cuando se cambia el estado de un checkbox de los ROLES.
   * @param event 
   */
  onChangeCheckRole(event) {
    const controlRoles = this.roles;

    if (event.checked) {
      this.agregarControlRole(event.source.value);
      // controlRoles.push(new FormControl(event.source.value))
    } else {
      this.removerControlRole(event.source.value);
      // const i = controlRoles.controls.findIndex(x => x.value === event.source.value);
      // controlRoles.removeAt(i);
    }
  }


  /**
   * Metodo q se va a llamar cuando se intente abandonar la url actual.
   * Este metodo se llama a traves de el Guard Deactivate (util/guards/CanDeactivate)
   * 
   * @returns True abandona la ruta actual hacia la proxima 
   * ruta sino (False) se mantine en la ruta actual.
   */
  public canDeactivate(): Observable<boolean> | boolean {
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

  /**
   * Retorna el mensaje de error asociado con el campo q no cumpla las reglas de validacion
   */
  getErrorMessage(campo: string) {

    switch (campo) {
      case 'email': {
        if (this.email.hasError('required')) {
          return 'Proporcione un correo electrónico.';
        }
        if (this.email.hasError('email')) {
          return 'Proporcione un correo electrónico válido.';
        }
        if (this.email.hasError('maxlength') || this.email.hasError('minlength')) {
          return 'El correo electrónico tiene que tener menos de 100 caracteres.';
        }
        break;
      }
      case 'password': {
        if (this.password.hasError('required')) {
          return 'Proporcione un clave.';
        }
        if (this.password.hasError('maxlength') || this.password.hasError('minlength')) {
          return 'La clave tiene que tener entre 6 y 100 caracteres.';
        }
        if (this.password.hasError('pattern')) {
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
   * Varifica q dos campos contengan el mismo valor.
   * Se le pasan por parametros las claves de los campos a comprobar.
   * En este caso se le pasaran las claves de los campos password y conformPassword 
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

  /**
   * Retorna TRUE si se han realizados cambios en el formulario
   */
  private hayCambiosForm() {
    return (this.email.value ||
      this.password.value ||
      this.confirmPassword.value
    );
  }
}
