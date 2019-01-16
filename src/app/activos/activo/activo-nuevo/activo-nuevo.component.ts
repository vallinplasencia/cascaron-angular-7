import { Component, OnInit } from '@angular/core';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormGroupDirective, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ActivoService } from '../../../acceso-datos/repos/activo.service';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { Activo } from '../../../acceso-datos/models/activo';
import { SnackbarOkComponent } from '../../../template/snackbar/snackbar-ok/snackbar-ok.component';
import { Util } from '../../../util/util';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { Categoria } from '../../../acceso-datos/models/categoria';
import { Responsable } from '../../../acceso-datos/models/responsable';
import { ActivoCampos } from '../../../acceso-datos/util/entidades/activos';
import { ResponsablesDialogComponent } from '../../../configuracion/responsable/responsables-dialog/responsables-dialog.component';




// // Depending on whether rollup is used, moment needs to be imported differently.
// // Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// // syntax. However, rollup creates a synthetic default module and we thus need to import it using
// // the `default as` syntax.
// import * as _moment from 'moment';
// // tslint:disable-next-line:no-duplicate-imports
// // import {default as _rollupMoment} from 'moment';
// // const moment = _rollupMoment || _moment;
// const moment = _moment;

@Component({
  selector: 'app-activo-nuevo',
  templateUrl: './activo-nuevo.component.html',
  styleUrls: ['./activo-nuevo.component.css']
})
export class ActivoNuevoComponent implements OnInit {

  //Accion q se ejecuta al hacer submit al boton e guardar
  accion = 'salvar';
  enviando: boolean = false;
  //Errores de validacion 
  errores: Errorr = null;
  //Ocurrio algun error al enviar datos al servidor
  ocurrioError: boolean = false;

  subscripSalvar: Subscription = null;
  //Subscription de cargando los datos de los campos
  subscripCampos: Subscription = null;

  //Nombre del responsale selecc en el dialog.
  nombRespSelecc: string = '';

  //Arreglo de categorias a seleccionar en el campo categoriaId del nuevo activo.
  categorias: Categoria[] = [];

  //ItemData<Responsable> incial de responsables q se va a mostrar en el listar a seleccionar en el nuevo activo.
  respIniItemData: ItemData<Responsable[]>;

  activoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]],
    unidades: ['', [Validators.required, Validators.max(99)]],
    esPrincipal: [false],
    // fechaAlta: [moment(), [Validators.required]],
    // fechaAlta: [{value: moment(), disabled: true}, [Validators.required]],
    fechaAlta: ['', [Validators.required]],
    categoriaId: ['', [Validators.required]],
    responsableId: ['']
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private repo: ActivoService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  public ngOnInit() {
    //Obtengo los datos del resolver
    this.route.data
      .subscribe((data: { itemData: ItemData<ActivoCampos | Errorr> }) => {
        switch (data.itemData.codigo) {
          case CodigoApp.OK: {
            const campos = data.itemData.data as ActivoCampos;
            this.categorias = campos.categorias;
            this.respIniItemData = campos.responsables;
            break;
          }
          default: {
            this.manejoError(data.itemData.codigo, data.itemData as ItemData<Errorr>)
          }
        }
      });
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

  onSubmit(formDirective: FormGroupDirective) {
    this.errores = null;
    this.enviando = true;
    this.ocurrioError = false;

    this.snackBar.dismiss();

    this.subscripSalvar = this.repo
      .salvar(this.activoForm.value)
      .subscribe(data => {
        this.enviando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            let act = data.data as Activo;
            this.errores = null;
            this.ocurrioError = false;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ['Se guardó correctamente la activo:', act.nombre],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            formDirective.resetForm();
            this.activoForm.reset();
            this.nombRespSelecc = '';

            if (this.accion == 'salvar') {
              this.router.navigate([{ outlets: { primary: 'activos/activo', sidebar: 'activo' } }]);
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
   * Retorna el mensaje de error asociado con el campo q no cumpla las reglas de validacion
   */
  getErrorMessage(campo: string) {

    switch (campo) {
      case 'nombre': {
        if (this.nombre.hasError('required')) {
          return 'Proporcione un nombre para la activo.';
        }
        if (this.nombre.hasError('maxlength')) {
          return 'El nombre del activo tiene q tener entre 5 y 50 caracteres.';
        }
        if (this.nombre.hasError('minlength')) {
          return 'El nombre del activo tiene q tener entre 5 y 50 caracteres.';
        }
        break;
      }
      case 'unidades': {
        if (this.unidades.hasError('required')) {
          return 'Proporcione un número para las unidades.';
        }
        if (this.unidades.hasError('max')) {
          return 'Las cantidad de unidades debe ser menor que 100.';
        }
        break;
      }
      case 'fechaAlta': {
        if (this.fechaAlta.hasError('matDatepickerParse')) {
          return 'Proporcione una fecha con el formato DD/MM/AAAA.';
        }
        // return this.fechaAlta.errors;
        if (this.fechaAlta.hasError('required')) {
          return 'Proporcione una fecha correcta.';
        }
        break;
      }
      case 'categoriaId': {
        if (this.categoriaId.hasError('required')) {
          return 'Seleccione una categoria.';
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
   * Abre el dialog para seleccionar el Responsable
   */
  abrirRespDialog(): void {
    const dialogRef = this.dialog.open(ResponsablesDialogComponent, {
      width: '600px',
      data: { itemData: this.respIniItemData }
    });

    dialogRef.afterClosed().subscribe((respSelecc: Responsable | boolean) => {
      if (respSelecc) {//Si selecciono un responsable
        respSelecc = respSelecc as Responsable;
        this.responsableId.patchValue(respSelecc.id);
        this.nombRespSelecc = respSelecc.nombre;
      }
    });
  }

  /**
   * Retorna el texto segun la opcion seleccionada en el select q se le aplique
   * @param tipo Select q se le va a aplicar
   */
  textSelectSelecc(tipo: 'categorias'): string {
    let texto: string = '-';

    switch (tipo) {
      case 'categorias': {
        const valor = this.categoriaId.value;
        const cat = this.categorias.find((c) => c.id == valor);
        texto = cat ? cat.nombre : '-';
        break;
      }
    }
    return texto;
  }

  /**
   * Borra el responsable seleecionado del formulario
   */
  borrarResponsable() {
    this.nombRespSelecc = '';
    this.responsableId.patchValue('');
  }

  /**
   * Retorna el campo activo(FormControl)
   */
  get nombre() {
    return this.activoForm.get('nombre');
  }

  /**
   * Retorna el campo valor(FormControl)
   */
  get unidades() {
    return this.activoForm.get('unidades');
  }

  /**
   * Retorna el campo esPrincipal(FormControl)
   */
  get esPrincipal() {
    return this.activoForm.get('esPrincipal');
  }

  /**
   * Retorna el campo fechaAlta(FormControl)
   */
  get fechaAlta() {
    return this.activoForm.get('fechaAlta');
  }

  /**
   * Retorna el campo categoriaId(FormControl)
   */
  get categoriaId() {
    return this.activoForm.get('categoriaId');
  }
  /**
   * Retorna el campo responsableId(FormControl)
   */
  get responsableId() {
    return this.activoForm.get('responsableId');
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
    return (this.nombre.value ||
      this.esPrincipal.value ||
      this.fechaAlta.value ||
      this.unidades.value ||
      this.categoriaId.value ||
      this.responsableId.value
    );
  }

}
