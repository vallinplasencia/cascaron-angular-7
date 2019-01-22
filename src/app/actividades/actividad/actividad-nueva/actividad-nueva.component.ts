import { Component, OnInit } from '@angular/core';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { Subscription, Observable } from 'rxjs';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Validators, FormBuilder, FormGroupDirective, FormArray, FormControl, ValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActividadService } from '../../../acceso-datos/repos/actividad.service';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { ActividadCampos } from '../../../acceso-datos/util/entidades/actividad-campos';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { Trabajador } from '../../../acceso-datos/models/trabajador';
import { Util } from '../../../util/util';
import { Actividad } from '../../../acceso-datos/models/actividad';
import { SnackbarOkComponent } from '../../../template/snackbar/snackbar-ok/snackbar-ok.component';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { TrabajadoresDialogComponent } from '../../trabajador/trabajadores-dialog/trabajadores-dialog.component';
// import { sumaPorcientoValidator } from '../suma-porciento-validator.directive';

/** La suma de los porcientos de las tareas no puede ser mayor q 100 */
export const sumaPorcientoValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const tareasArr = control.get('tareas') as FormArray;
  const tareasGroup = tareasArr.controls; 
  let porcentaje = 0;
  tareasGroup.forEach(tg => {
    porcentaje += tg.get('porcentaje').value;
  });

  return (porcentaje != 100) ? { 'sumaPorciento': true } : null;
  // return (porcentaje < 1 || porcentaje > 100) ? { 'sumaPorciento': true } : null;
};

@Component({
  selector: 'app-actividad-nueva',
  templateUrl: './actividad-nueva.component.html',
  styleUrls: ['./actividad-nueva.component.css']
})
export class ActividadNuevaComponent implements OnInit {

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

  //Nombre del trabajador selecc en el dialog.
  nombTrabSelecc: string = '';

  //ItemData<Trabajador> incial de trabajadores q se va a mostrar en el listar a seleccionar en el nuevo actividad.
  trabIniItemData: ItemData<Trabajador[]>;

  actividadForm = this.fb.group({
    titulo: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(500)]],
    // fechaAlta: [moment(), [Validators.required]],
    // fechaAlta: [{value: moment(), disabled: true}, [Validators.required]],
    trabajadorId: ['', [Validators.required]],
    trabajadorNombre: ['', [Validators.required]],
    tareas: this.fb.array([
      this.fb.group({
        nombre: ['', [Validators.required, Validators.maxLength(100)]],
        porcentaje: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
      })
    ])
  },  { validator: sumaPorcientoValidator });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private repo: ActividadService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private dialogConfirm: DialogConfirmSimpleService
  ) { }

  public ngOnInit() {
    //Obtengo los datos del resolver
    this.route.data
      .subscribe((data: { itemData: ItemData<ActividadCampos | Errorr> }) => {
        switch (data.itemData.codigo) {
          case CodigoApp.OK: {
            const campos = data.itemData.data as ActividadCampos;
            this.trabIniItemData = campos.trabajadores;
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
    let valorForm = this.actividadForm.value;
    delete valorForm.trabajadorNombre

    this.subscripSalvar = this.repo
      .salvar(valorForm)
      .subscribe(data => {
        this.enviando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            let act = data.data as Actividad;
            this.errores = null;
            this.ocurrioError = false;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ['Se guardó correctamente la actividad:', act.titulo],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            formDirective.resetForm();
            this.actividadForm.reset();
            this.nombTrabSelecc = '';

            //Elimino todos los subformularios de TAREAS excepto 1
            while(this.tareas.length > 1){
              this.removerTarea(this.tareas.length-1);
            }

            if (this.accion == 'salvar') {
              this.router.navigate([{ outlets: { primary: 'actividades/actividad', sidebar: 'actividad' } }]);
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
  getErrorMessage(campo: string, posTarea: number = 0) {

    switch (campo) {
      case 'titulo': {
        if (this.titulo.hasError('required')) {
          return 'Proporcione un titulo para esta actividad.';
        }
        if (this.titulo.hasError('maxlength')) {
          return 'El titulo del actividad tiene que tener menos de 100 caracteres.';
        }
        break;
      }
      case 'descripcion': {
        if (this.descripcion.hasError('maxlength')) {
          return 'La descripción de la actividad tiene que tener menos de 500 caracteres.';
        }
        break;
      }
      case 'trabajadorId': {
        if (this.trabajadorId.hasError('required')) {
          return 'Seleccione el trabajador que se le asignará esta actividad.';
        }
        break;
      }
      case 'trabajadorNombre': {
        if (this.trabajadorId.hasError('required')) {
          return 'Seleccione el trabajador que se le asignará esta actividad.';
        }
        break;
      }
      case 'tnombre': {
        if (this.tNombre(posTarea).hasError('required')) {
          return 'Proporcione un nombre para la tarea.';
        }
        if (this.tNombre(posTarea).hasError('maxlength')) {
          return 'El nombre de la tarea tiene que tener menos de 100 caracteres.';
        }
        break;
      }
      case 'tporcentaje': {
        if (this.tPorcentaje(posTarea).hasError('required')) {
          return 'Proporcione el porcentaje de esta tarea.';
        }
        if (this.tPorcentaje(posTarea).hasError('max')) {
          return 'El valor del porcentaje debe de ser menor o igual a 100.';
        }
        if (this.tPorcentaje(posTarea).hasError('min')) {
          return 'El valor del porcentaje debe de ser mayor que 1.';
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
   * Abre el dialog para seleccionar el trabajador
   */
  abrirTrabDialog(): void {
    const dialogRef = this.dialog.open(TrabajadoresDialogComponent, {
      width: '600px',
      data: { itemData: this.trabIniItemData }
    });

    dialogRef.afterClosed().subscribe((trabSelecc: Trabajador | boolean) => {
      if (trabSelecc) {//Si selecciono un trabajador
        trabSelecc = trabSelecc as Trabajador;
        this.trabajadorId.patchValue(trabSelecc.userId);
        this.nombTrabSelecc = trabSelecc.nombre;

        this.trabajadorNombre.patchValue(trabSelecc.nombre);
      }
    });
  }

  /**
   * Cuando se presiona una tecla en el campo de seleccionar el trabajador
   * para asignarselo a la actividad. Se abre el dialog se seleccionar el trabaj.
   * @param event 
   */
  keyDownAbrirDialog(event) {
    event.preventDefault();
    event.stopPropagation();

    this.abrirTrabDialog();
  }

  /**
   * Borra el trabajador seleecionado del formulario
   */
  borrarTrabajador() {
    this.nombTrabSelecc = '';
    this.trabajadorId.patchValue('');

    this.trabajadorNombre.patchValue('');
  }

  /**
   * Retorna el procentaje q va quedando disponible para asignarle a las 
   * proximas tareas.
   */
  porcentajeLibre(){
    const tareasGroup = this.tareas.controls; 
    let porcentaje = 0;
    tareasGroup.forEach(tg => {
      porcentaje += tg.get('porcentaje').value;
    });
    return 100-porcentaje;
  }

  /**
   * Retorna el campo titulo(FormControl)
   */
  get titulo() {
    return this.actividadForm.get('titulo');
  }

  /**
   * Retorna el campo descripcion(FormControl)
   */
  get descripcion() {
    return this.actividadForm.get('descripcion');
  }


  /**
   * Retorna el campo trabajadorId(FormControl)
   */
  get trabajadorId() {
    return this.actividadForm.get('trabajadorId');
  }

  /**
   * Retorna el campo trabajadorNombre(FormControl)
   * Este campo lo uso solo para hacer comprobacion de validacion en 
   * el formulario. Este NO lo envio al backend 
   */
  get trabajadorNombre() {
    return this.actividadForm.get('trabajadorNombre');
  }

  /**
   * Retorna el campo tareas(FormArray)
   */
  get tareas() {
    return this.actividadForm.get('tareas') as FormArray;
  }

  /**
   * Retorna el campo nombre(FormControl) de la TAREA q se encuentra en la 
   * posicion del parametro
   * @param posTarea posicion de la tarea dentro del arreglo de tareas del formulario
   */
  tNombre(posTarea){
    return this.tareas.at(posTarea).get('nombre');
  }

  /**
   * Retorna el campo porcentaje(FormControl) de la TAREA q se encuentra en la 
   * posicion del parametro
   * @param posTarea posicion de la tarea dentro del arreglo de tareas del formulario
   */
  tPorcentaje(posTarea){
    return this.tareas.at(posTarea).get('porcentaje');
  }


  /**
   * Agrega una nueva tarea(FormGroup) al formulario de actividades
   */
  agregarNuevaTarea() {
    this.tareas.push(
      this.fb.group({
        nombre: ['', [Validators.required, Validators.maxLength(100)]],
        porcentaje: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
      })
    );
  }

  /**
   * Elimina una tarea(FormGroup) del arraglo de tareas de formulario
   * @param posTarea posicion de la tarea dentro del arreglo de tareas del formulario
   */
  removerTarea(posTarea: number){
    this.tareas.removeAt(posTarea);
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
    return (this.titulo.value ||
      this.descripcion.value ||
      this.trabajadorId.value ||
      this.trabajadorNombre.value
    );
  }

}
