import { Component, OnInit } from '@angular/core';
import { Errorr } from '../../../acceso-datos/util/entidades/errorr';
import { Subscription, Observable } from 'rxjs';
import { ItemData } from '../../../acceso-datos/util/entidades/item-data';
import { Trabajador } from '../../../acceso-datos/models/trabajador';
import { Actividad } from '../../../acceso-datos/models/actividad';
import { Validators, FormBuilder, FormGroupDirective, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar, MatRadioChange, MatCheckboxChange } from '@angular/material';
import { ActividadService } from '../../../acceso-datos/repos/actividad.service';
import { DialogConfirmSimpleService } from '../../../util/services/dialog-confirm-simple.service';
import { ActividadCampos } from '../../../acceso-datos/util/entidades/actividad-campos';
import { CodigoApp } from '../../../acceso-datos/util/codigo-app';
import { sumaPorcientoValidator } from '../actividad-nueva/actividad-nueva.component';
import { Util } from '../../../util/util';
import { SnackbarOkComponent } from '../../../template/snackbar/snackbar-ok/snackbar-ok.component';
import { TrabajadoresDialogComponent } from '../../trabajador/trabajadores-dialog/trabajadores-dialog.component';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import { SnackbarErrorComponent } from '../../../template/snackbar/snackbar-error/snackbar-error.component';
import { EstadosActividad } from '../../../acceso-datos/util/estados-actividad.enum';
import { Tarea } from '../../../acceso-datos/models/tarea';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
// const moment = _rollupMoment || _moment;
const moment = _moment;

@Component({
  selector: 'app-actividad-editar',
  templateUrl: './actividad-editar.component.html',
  styleUrls: ['./actividad-editar.component.css']
})
export class ActividadEditarComponent implements OnInit {

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

  //Actividad q se va a modificar
  item: Actividad = null;

  //Contiene todos los estados disponibles q se le puede asignar a una actividad.
  estadosDeDisponAct: { id: number, nombre: string }[];

  actividadForm = this.fb.group({
    titulo: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(500)]],
    fechaRegistro: [moment(), [Validators.required]],
    // fechaAlta: [{value: moment(), disabled: true}, [Validators.required]],
    trabajadorId: ['', [Validators.required]],
    trabajadorNombre: ['', [Validators.required]],
    estado: [EstadosActividad.Asignada, [Validators.required]],
    tareas: this.fb.array([
      // this.fb.group({
      //   nombre: ['', [Validators.required, Validators.maxLength(100)]],
      //   porcentaje: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      //   realizada: [false, [Validators.required]],
      // })
    ])
  }, { validator: sumaPorcientoValidator });


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
    this.setEstadosDisponiblesAct();

    //Obtengo los datos del resolver
    this.route.data
      .subscribe((data: { itemData: ItemData<ActividadCampos | Errorr> }) => {
        switch (data.itemData.codigo) {
          case CodigoApp.OK: {
            let tt: Tarea[] = [{ nombre: "", porcentaje: 0, realizada: false }];
            const campos = data.itemData.data as ActividadCampos;
            this.item = campos.item;
            this.nombTrabSelecc = this.item.asignadaA ? this.item.asignadaA.nombre : '';
            this.trabIniItemData = campos.trabajadores;
            this.actividadForm.patchValue(
              {
                titulo: this.item.titulo,
                descripcion: this.item.descripcion,
                estado: this.item.estado,
                trabajadorId: this.item.asignadaAId,
                trabajadorNombre: this.item.asignadaA ? this.item.asignadaA.nombre : '',
                fechaRegistro: this.item.fechaRegistro,
                // tareas: this.item.tareas
                // tareas: this.item.tareas
              }
            );
            //Hago aqui lo de tarea pq arriva con lo de patchValue y setValue en
            //el formulario no mi PINCHA. Solo muestra la primera tarea.
            if (this.item.tareas.length) {
              this.item.tareas.forEach(t => this.agregarNuevaTarea(t));
            } else {
              //Si la actividad no tiene tarea agrego una SIN valores.
              this.agregarNuevaTarea();
            }
            if (this.item.estado == EstadosActividad.Cumplida) {
              //Selecciono el campo REALIZADO de cada tarea. Pues se selecciono el
              //estado CUMPLIDA
              this.tareas.controls.forEach(ct => {
                let controlRealizada = ct.get('realizada');
                // controlRealizada.setValue(true);
                controlRealizada.disable();
              });
            }

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

  onSubmit(formDirective: FormGroupDirective, evento) {

    if(this.estado.value != EstadosActividad.Cumplida && this.tareas.controls.every(tc=>tc.get('realizada').value)){
      this.snackBar.open("Actualice el estado de la actividad a CUMPLIDO pues todas las tareas están realizadas.", "X");
      return;
    }
    //Pone ENABLE todos los campos de REALIZADA de cada tarea pues si estan
    //desactivado no se envian al Backend y los campos REALIZADA estan desactivado
    //si se selecciono el estado de la tarea CUMPLIDO.
    for (let k = 0; k < this.tareas.controls.length; k++) {
      this.tRealizada(k).enable();
    }

    this.errores = null;
    this.enviando = true;
    this.ocurrioError = false;
    this.snackBar.dismiss();
    let datosSalvar = this.actividadForm.value;
    datosSalvar.id = this.item.id;

    this.subscripSalvar = this.repo
      .salvar(datosSalvar, this.item.id)
      .subscribe(data => {
        this.enviando = false;

        switch (data.codigo) {
          case CodigoApp.OK: {
            let act = data.data as Actividad;
            this.item = act;

            //Pequenno problemita q se presento. Lo RESUELVO con esto y lo hago 
            //asi para despues poder abandonar la pagina. Arreglar mas tarde.
            this.item.asignadaAId = act['trabajadorId'];

            this.errores = null;
            this.ocurrioError = false;
            setTimeout(() => {
              this.snackBar.openFromComponent(SnackbarOkComponent, {
                data: ['Se guardó correctamente la actividad:', act.titulo],
                duration: Util.SNACKBAR_DURACION_OK,
              });
            });
            // formDirective.resetForm();
            // this.actividadForm.reset();
            // this.nombTrabSelecc = '';


            this.router.navigate([{ outlets: { primary: 'actividades/actividad', sidebar: ['actividad'] } }]);
            console.log('navegacion')
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
    // if (this.fechaAlta.hasError('matDatepickerParse')) {
    //   return 'Proporcione una fecha con el formato DD/MM/AAAA.';
    // }
    switch (campo) {
      case 'titulo': {
        if (this.titulo.hasError('required')) {
          return 'Proporcione un titulo para esta actividad.';
        }
        if (this.titulo.hasError('maxlength')) {
          return 'El titulo de la actividad tiene que tener menos de 100 caracteres.';
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
      case 'fechaRegistro': {
        if (this.descripcion.hasError('required')) {
          return 'Proporcione la fecha de registro para esta actividad.';
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
   * Establece el valor de la fecha vacio al campo pasado por parametro si no es 
   * una fecha valida el valor q se le entra.
   * @param campoFecha Campo q se le va a establecer la fecha a vacia si no es 
   * valido el valor entrado.
   * @param evento
   */
  comprobarFecha(campoFecha: string, evento) {
    let target = evento.target;
    if (target.value == '') {
      return;
    }
    if (!moment(target.value, 'DD/MM/YYYY').isValid()) {
      // target.value = '';
      switch (campoFecha) {
        case 'fechaRegistro':
          this.fechaRegistro.patchValue(this.item.fechaRegistro);
          break;
      }
    }
  }


  /**
   * Retorna el procentaje q va quedando disponible para asignarle a las 
   * proximas tareas.
   */
  porcentajeLibre() {
    const tareasGroup = this.tareas.controls;
    let porcentaje = 0;
    tareasGroup.forEach(tg => {
      porcentaje += tg.get('porcentaje').value;
    });
    return 100 - porcentaje;
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
   * Retorna el campo fechaRegistro(FormControl)
   */
  get fechaRegistro() {
    return this.actividadForm.get('fechaRegistro');
  }

  /**
   * Retorna el campo estado(FormControl)
   */
  get estado() {
    return this.actividadForm.get('estado');
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
  tNombre(posTarea: number) {
    return this.tareas.at(posTarea).get('nombre');
  }

  /**
   * Retorna el campo porcentaje(FormControl) de la TAREA q se encuentra en la 
   * posicion del parametro
   * @param posTarea posicion de la tarea dentro del arreglo de tareas del formulario
   */
  tPorcentaje(posTarea: number) {
    return this.tareas.at(posTarea).get('porcentaje');
  }

  /**
   * Retorna el campo id(FormControl) de la TAREA q se encuentra en la 
   * posicion del parametro
   * @param posTarea posicion de la tarea dentro del arreglo de tareas del formulario
   */
  tId(posTarea: number) {
    return this.tareas.at(posTarea).get('id');
  }

  /**
   * Retorna el campo realizada(FormControl) de la TAREA q se encuentra en la 
   * posicion del parametro
   * @param posTarea posicion de la tarea dentro del arreglo de tareas del formulario
   */
  tRealizada(posTarea: number) {
    return this.tareas.at(posTarea).get('realizada');
  }


  /**
   * Agrega una nueva tarea(FormGroup) al formulario de actividades
   */
  agregarNuevaTarea(tarea: Tarea = null) {
    console.log('xx', tarea)
    this.tareas.push(
      this.fb.group({
        id: [tarea ? tarea.id : 0],
        nombre: [tarea ? tarea.nombre : '', [Validators.required, Validators.maxLength(100)]],
        porcentaje: [tarea ? tarea.porcentaje : '', [Validators.required, Validators.min(1), Validators.max(100)]],
        realizada: [tarea ? tarea.realizada : false, [Validators.required]],
      })
    );

    // if (!tarea && this.item.estado == EstadosActividad.Cumplida) {
    //   this.estado.setValue(EstadosActividad.Asignada);
    //   this.tareas.controls.forEach(ct => ct.get('realizada').enable());
    //   this.snackBar.open("Cambió el estado de la actividad a Asignado.", "X");
    // }
  }

  /**
   * Elimina una tarea(FormGroup) del arraglo de tareas de formulario
   * @param posTarea posicion de la tarea dentro del arreglo de tareas del formulario
   */
  removerTarea(posTarea: number) {
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
    //Importante hacer esta comprobacion por si ha ocurrido algun error al obtener
    //el item para despues poder abandonar esta pagina
    if (!this.item) {
      return false;
    }

    let cambiosFormTareas = false;

    if (this.item.tareas.length != this.tareas.length) {
      cambiosFormTareas = true;
    } else {
      this.item.tareas.forEach((t, idx) => {
        if (
          t.nombre != this.tNombre(idx).value ||
          t.porcentaje != this.tPorcentaje(idx).value ||
          t.realizada != this.tRealizada(idx).value
        ) {
          cambiosFormTareas = true;
          return;
        }
      });
    }

    return (
      this.item.titulo != this.titulo.value ||
      this.item.descripcion != this.descripcion.value ||
      this.item.asignadaAId != this.trabajadorId.value ||
      this.item.fechaRegistro != this.fechaRegistro.value ||
      this.item.estado != this.estado.value || cambiosFormTareas
    );
  }

  /**
   * Establece todos los estados q puede tener una ACTIVIDAD.
   * Los uso en el template para poner los radios del estado q se encuentra 
   * la actividad
   */
  private setEstadosDisponiblesAct() {
    let estados = Object.keys(EstadosActividad)
      .filter(key => typeof EstadosActividad[key] === 'number')
      .map(key => ({ id: EstadosActividad[key], nombre: key }));
    this.estadosDeDisponAct = estados;
  }

  /**
   * Retorna TRUE si algunos de los campos de todas las TAREAS tiene el 
   * estado touched o dirty
   */
  isPorcentajeTouchOrDirty() {
    for (let i = 0; i < this.tareas.length; i++) {
      if (this.tPorcentaje(i).touched || (this.tPorcentaje(i).dirty)) {
        return true;
      }
    }
  }

  /**
   * Marca todas las TAREAS de esta Actividad como REALIZADAS cuando el 
   * ESTADO de la actividad se selecciona CUMPLIDO en caso contrario pone
   * el campo REALIZADO al estado cuando se recupero la actividad del Backend.
   * @param event 
   */
  onChangeEstado(event: MatRadioChange) {
    this.snackBar.dismiss();
    switch (event.value) {
      case EstadosActividad.Cumplida: {
        this.snackBar.open("Todas las tareas de esta actividad se marcaron como Realizada.", "X")
        //Selecciono el campo REALIZADO de cada tarea. Pues se selecciono el
        //estado CUMPLIDA
        this.tareas.controls.forEach(ct => {
          let controlRealizada = ct.get('realizada');
          controlRealizada.setValue(true);
          controlRealizada.disable();
        });
        break;
      }
      default: {
        // //Pongo el campo Realizada de cada Tarea al valor inicial q traia de
        // //la base de datos
        for (let k = 0; k < this.tareas.controls.length; k++) {

          let ttt = this.item.tareas.find(t => t.id == this.tId(k).value);
          if (ttt) {
            this.tRealizada(k).setValue(ttt.realizada);
            //Activo los campos Realizados pq al marcar CUMPLIDO una actividad
            //Se  desativan todos los campos Realizados
            this.tRealizada(k).enable();
          }else{
            this.tRealizada(k).setValue(false);
            this.tRealizada(k).enable();
          }
        }
      }
    }
  }

  /**
   * Cuando se cambie el estado del Checkbox REALISADO de cada tarea se 
   * verifica si estan todas la tareas seleccionada para seleccionar el
   * radio de la ACTIVIDAD q le corresponde al ESTADO como CUMPLIDA
   * @param event 
   */
  onChangeRealizado(event: MatCheckboxChange) {
    if (this.tareas.controls.every(ct => ct.get('realizada').value)) {
      this.estado.setValue(EstadosActividad.Cumplida);
      this.tareas.controls.forEach(ct => ct.get('realizada').disable());
    }
  }

  /**
   * Retorna TRUE si la actividad es cumplida
   */
  isCumplida(){
    return this.estado.value == EstadosActividad.Cumplida;
  }

}

