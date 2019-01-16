import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../../acceso-datos/models/categoria';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { Subscription, Observable } from 'rxjs';
import { CategoriaService } from '../../../acceso-datos/repos/categoria.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Util } from '../../../util/util';
import { SnackbarOkComponent } from '../../../template/snackbar/snackbar-ok/snackbar-ok.component';

@Component({
  selector: 'app-categoria-editar',
  templateUrl: './categoria-editar.component.html',
  styleUrls: ['./categoria-editar.component.css']
})
export class CategoriaEditarComponent implements OnInit {

  categoriaUpd: Categoria;

  categoriaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    valor: new FormControl('', [Validators.required])
  });

  enviando: boolean = false;
  //Errores de validacion
  errores: Errorr = null;
  //Posibilita q si se esta mostrando un snackBar de error se oculte y si es otro snackbar se muestre hasta q se cumpla el tiempo.
  ocurrioError: boolean = false;
  subscripSalvar: Subscription = null;

  constructor(
    private categoriaRepo: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: { itemData: ItemData<Categoria | Errorr> }) => {
        //Obtengo los datos del resolver
        switch (data.itemData.codigo) {
          case CodigoApp.OK: {
            this.ocurrioError = false;
            this.categoriaUpd = data.itemData.data as Categoria;
            this.categoriaForm.patchValue({
              nombre: this.categoriaUpd.nombre,
              valor: this.categoriaUpd.valor
            });
            break;
          }
          
          default: {
            this.categoriaUpd = null;
            this.manejoError(data.itemData.codigo, data.itemData as ItemData<Errorr>)
            break;
          }
        }
      });
  }

  onSubmit(formDirective: FormGroupDirective) {

    this.errores = null;
    this.enviando = true;
    this.snackBar.dismiss();
    let datosSalvar = this.categoriaForm.value;
    datosSalvar.id = this.categoriaUpd.id;

    this.subscripSalvar = this.categoriaRepo
      .salvar(datosSalvar, this.categoriaUpd.id)
      .subscribe(data => {
        this.enviando = false;
        
        switch (data.codigo) {

          case CodigoApp.OK: {
            let categ = data.data as Categoria;
            this.categoriaUpd = categ;
            this.ocurrioError = false;
            this.errores = null;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ['Se guardaron correctamente los cambios de la categoria:', categ.nombre],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            // formDirective.resetForm();
            // this.categoriaForm.reset();
            this.router.navigate([{ outlets: { primary: 'configuracion/categoria', sidebar: ['configuracion'] } }]);
            break;
          }
          case CodigoApp.ERROR_VALIDACION: {
            this.ocurrioError = false;//Los errores de validacion no se registran como errores fuertes
            this.errores = data.data as Errorr
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

  canDeactivate(): Observable<boolean> | boolean {
    if (this.ocurrioError) {
      this.snackBar.dismiss();
    }
    if (this.enviando) {
      this.snackBar.open(
        'No puede abandonar esta ventana pues se está guardando información. Cancele primero para navegar a otra ventana.',
        'X',
        {
          duration: Util.SNACKBAR_DURACION_INFORMACION
        });
      return false;
    }
    if (this.categoriaUpd && ((this.categoriaUpd.nombre != this.nombre.value) || (this.categoriaUpd.valor != this.valor.value))) {
      return this.dialogConfirm.confirm("Si continua se perderán los cambios. \nDesea continuar?");
    }
    return true;
  }

  cancelarEnvio() {
    this.enviando = false;
    this.snackBar.dismiss();

    if (this.subscripSalvar) {
      this.subscripSalvar.unsubscribe();
    }
  }

  /**
   * Retorna True si los datos del formulario cambiaron.
   */
  activarBotonSubmit(): boolean {
    return !(this.categoriaForm.valid && ((this.categoriaUpd.nombre != this.nombre.value)|| (this.categoriaUpd.valor != this.valor.value)))
    // return !this.categoriaUpd.categoria == this.categoriaForm.value
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
