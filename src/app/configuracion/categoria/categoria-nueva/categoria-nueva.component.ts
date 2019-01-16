import { Component, OnInit } from '@angular/core';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { CategoriaService } from '../../../acceso-datos/repos/categoria.service';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { Categoria } from '../../../acceso-datos/models/categoria';
import { SnackbarOkComponent } from '../../../template/snackbar/snackbar-ok/snackbar-ok.component';
import { Util } from '../../../util/util';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';

@Component({
  selector: 'app-categoria-nueva',
  templateUrl: './categoria-nueva.component.html',
  styleUrls: ['./categoria-nueva.component.css']
})
export class CategoriaNuevaComponent implements OnInit {

  accion = 'salvar';
  enviando: boolean = false;
  //Errores de validacion 
  errores: Errorr = null;
  ocurrioError: boolean = false;

  subscripSalvar: Subscription = null;

  categoriaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    valor: new FormControl('', [Validators.required, Validators.max(100)])
  });
  

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private repo: CategoriaService,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  ngOnInit() { }

  onSubmit(formDirective: FormGroupDirective) {
    this.errores = null;
    this.enviando = true;
    this.snackBar.dismiss();

    this.subscripSalvar = this.repo
      .salvar(this.categoriaForm.value)
      .subscribe(data => {
        this.enviando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            let categ = data.data as Categoria;
            this.errores = null;
            this.ocurrioError = false;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ['Se guardó correctamente la categoria:', categ.nombre],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            formDirective.resetForm();
            this.categoriaForm.reset();

            if (this.accion == 'salvar') {
              this.router.navigate([{ outlets: { primary: 'configuracion/categoria', sidebar: ['configuracion'] } }]);              
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
   * Retorna el campo categoria(FormControl)
   */
  get nombre() {
    return this.categoriaForm.get('nombre');
  }

  /**
   * Retorna el campo valor(FormControl)
   */
  get valor() {
    return this.categoriaForm.get('valor');
  }

  /**
   * Retorna el mensaje de error asociado con el campo q no cumpla las reglas de validacion
   */
  getErrorMessage(campo: string) {
    
    switch (campo) {
      case 'nombre': {
        if (this.nombre.hasError('required')) {
          return 'Proporcione un nombre para la categoria.';
        }
        if (this.nombre.hasError('maxlength')) {
          return 'La categoria tiene q tener entre 5 y 50 caracteres.';
        }
        if (this.nombre.hasError('minlength')) {
           return 'La categoria tiene q tener entre 5 y 50 caracteres.';
        }
        break;
      }
      case 'valor': {
        if (this.valor.hasError('required')) {
          return 'Proporcione un número para el valor.';
        }
        if (this.valor.hasError('max')) {
          return 'El valor puede ser hasta 99.';
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
    if (this.nombre.value || this.valor.value) {
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

}
