import { Injectable } from '@angular/core';
import { Urls } from '../util/urls';
import { HttpParams, HttpClient } from '@angular/common/http';
import { HandleError, ApiErrorHandlerService } from '../error/api-error-handler.service';
import { NgProgressRef, NgProgress } from '@ngx-progressbar/core';
import { ItemData } from '../util/entidades/item-data';
import { Actividad } from '../models/actividad';
import { Errorr } from '../util/entidades/errorr';
import { Observable } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { CodigoApp } from '../util/codigo-app';
import { ActividadCampos } from '../util/entidades/actividad-campos';
import { Trabajador } from '../models/trabajador';
import { Tarea } from '../models/tarea';

@Injectable({
  providedIn: 'root'
})
export class MisActividadService {
  private handleError: HandleError;
  private progressRef: NgProgressRef;

  constructor(
    private http: HttpClient,
    httpErrorHandler: ApiErrorHandlerService,
    private progress: NgProgress
  ) {
    this.handleError = httpErrorHandler.createHandleError('ActividadService');
    this.progressRef = this.progress.ref();
  }

  /**
   * Metodo que devuelve el listado de las actividades q me han sido asignadas o error a traves de un Observable. 
   * El listado devuelto va a cumplir con las restricciones pasadas por parametro.
   * @param pagina Numero de la pagina.
   * @param limite Cantidad de items a retornar
   * @param campOrdenar Campo por el q se va a ordenar el resultado. Opcional.
   * @param orden Orden q va a seguir el listado. Puede ser ASC o DESC.
   * @param filtro Campo q va a filtrar los resultados
   * @returns Observable<ItemData<Actividad[] | Errorr>> Rerona un observable q puede emitir
   * un ItemData con un arreglo de actividad si todo ocurrio normalmente o un ItemData con 
   * un Errorr si ocurrio algun problema de red o error en el server ...
   */
  public indexAsignadas(
    pagina: number, limite: number, campOrdenar: string = 'titulo', orden: ''|'asc' | 'desc' = 'asc', filtro: string = ''
  ): Observable<ItemData<Actividad[] | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.MIS_ACTIVIDADES);
    orden = orden || "asc";
    
    let params = new HttpParams()
      .set(Urls.PARAM_PAGINA, (pagina + 1).toString())
      .set(Urls.PARAM_LIMITE, limite.toString());


    params = params
      .set(Urls.PARAM_ORDENAR_POR, campOrdenar)
      .set(Urls.PARAM_ORDEN, orden);

    if (filtro) {
      params = params.set(Urls.PARAM_FILTRO, filtro);
    }

    return this.http
      .get<Actividad[]>(url, { observe: 'response', params: params })
      .pipe(
        map(resp => {
          let result: ItemData<Actividad[]>;
          result = {
            codigo: CodigoApp.OK,
            data: resp.body as Actividad[],
            meta: {
              total: +resp.headers.get(Urls.HEADER_TOTAL_COUNT)
            }
          };
          return result;
        }),
        catchError(this.handleError('index')),
        finalize(() => {this.progressRef.complete()})
      );
  }

  public realizarTarea(tarea: Tarea): Observable<ItemData<Tarea | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);
    let url = Urls.crearUrl(Urls.MIS_ACTIVIDADES);

    return this.http
      .put(`${url}/tarea/${tarea.id}/realizada`, {})
      .pipe(
        map(resp => {
          let result: ItemData<Tarea>;
          result = {
            codigo: CodigoApp.OK,
            data: tarea
          };
          return result;
        }),
        catchError(this.handleError('realizarTarea')),
        finalize(() => this.progressRef.complete())
      );
  }

  public salvar(actividad: Actividad, id: number = -1): Observable<ItemData<Actividad | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);
    let url = Urls.crearUrl(Urls.MIS_ACTIVIDADES);

    if (id == -1) {
      return this.http
        .post<Actividad>(url, actividad)
        .pipe(
          map(resp => {
            let result: ItemData<Actividad>;
            result = {
              codigo: CodigoApp.OK,
              data: resp
            };
            return result;
          }),
          catchError(this.handleError('salvar_nuevo')),
          finalize(() => this.progressRef.complete())
        );
    }
    return this.http
      .put(`${url}/${id}`, actividad)
      .pipe(
        map(resp => {
          let result: ItemData<Actividad>;
          result = {
            codigo: CodigoApp.OK,
            data: actividad
          };
          return result;
        }),
        catchError(this.handleError('salvar_actualizar')),
        finalize(() => this.progressRef.complete())
      );
  }

  public getActividadAsignada(id: number | string): Observable<ItemData<Actividad | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.MIS_ACTIVIDADES);
    return this.http
      .get<Actividad>(`${url}/${id}`)
      .pipe(
        map(resp => {
          let result: ItemData<Actividad>;
          result = {
            codigo: CodigoApp.OK,
            data: resp as Actividad
          };
          return result;
        }),
        catchError(this.handleError('getActividad')),
        finalize(() => this.progressRef.complete())
      );
  }

  public eliminar(id: number | string): Observable<ItemData<Actividad | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.MIS_ACTIVIDADES);

    return this.http
      .delete<Actividad>(`${url}/${+id}`)
      .pipe(
        map(resp => {
          let result: ItemData<Actividad>;
          result = {
            codigo: CodigoApp.OK,
            data: resp as Actividad
          };
          return result;
        }),
        catchError(this.handleError('eliminar')),
        finalize(() => this.progressRef.complete())
      );;
  }


  /**
   * Obtiene los datos q se le pueden asignar a algunos campos. Es decir los
   * valores de dichos campos se cargan del backend.
   * 
   * Los valores de los parametros del metodo se utilizan cuando se van a cargar 
   * grandes cantidades de datos para los campos y hay q utilizar paginacion para ello.
   * 
   * @param pagina Numero de la pagina para el paginador. Generalmente es la primera.
   * @param limite Cant de registros a retornas.
   * @param campOrdenar Campo por el q se van a ordenar los resultados.
   * @param orden Orden asc o desc.
   * @param filtro Si se va a aplicar algun criterio de busqueda para los resultados.
   */
  public getActividadCampos(limite: number, pagina: number = 1, campOrdenar: string = 'titulo', orden: '' | 'asc' | 'desc' = 'asc', filtro: string = ''
  ): Observable<ItemData<ActividadCampos | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.ACTIVIDADES_CAMPOS);
    orden = orden || "asc";

    let params = new HttpParams()
      .set(Urls.PARAM_PAGINA + 'Resp', pagina.toString())
      .set(Urls.PARAM_LIMITE + 'Resp', limite.toString());
    
    params = params
      .set(Urls.PARAM_ORDENAR_POR + 'Resp', campOrdenar)
      .set(Urls.PARAM_ORDEN + 'Resp', orden);

    if (filtro) {
      params = params.set(Urls.PARAM_FILTRO + 'Resp', filtro);
    }

    return this.http
      .get<{
        trabajadores: Trabajador[]
      }>(url, { observe: 'response', params: params })
      .pipe(
        map(resp => {
          let result: ItemData<ActividadCampos>;
          result = {
            codigo: CodigoApp.OK,
            data: {
              trabajadores: {
                codigo: CodigoApp.OK,
                data: resp.body.trabajadores,
                meta: {
                  total: +resp.headers.get(Urls.HEADER_TOTAL_COUNT_SEC_RESPONSABLES)
                }
              }
            }
          };
          return result;
        }),
        catchError(this.handleError('getActividadCampos')),
        finalize(() => this.progressRef.complete())
      );
  }

  /**
   * Obtiene el ITEM y los datos q se le pueden asignar a algunos campos. Es decir 
   * el item a modificar ylos valores de dichos campos q se cargan del backend.
   * 
   * Los valores de los parametros del metodo se utilizan cuando se van a cargar 
   * grandes cantidades de datos para los campos y hay q utilizar paginacion para ello.
   * 
   * @param id Identificador de el item a modificar.
   * @param pagina Numero de la pagina para el paginador. Generalmente es la primera.
   * @param limite Cant de registros a retornas.
   * @param campOrdenar Campo por el q se van a ordenar los resultados.
   * @param orden Orden asc o desc.
   * @param filtro Si se va a aplicar algun criterio de busqueda para los resultados.
   */
  public getActividadYCampos(id: number, limite: number, pagina: number = 1, campOrdenar: string = 'titulo', orden: '' | 'asc' | 'desc' = 'asc', filtro: string = ''
  ): Observable<ItemData<ActividadCampos | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(`${Urls.ACTIVIDADES_Y_CAMPOS}/${id}`);
    orden = orden || "asc";

    let params = new HttpParams()
      .set(Urls.PARAM_PAGINA + 'Resp', pagina.toString())
      .set(Urls.PARAM_LIMITE + 'Resp', limite.toString());
    
    params = params
      .set(Urls.PARAM_ORDENAR_POR + 'Resp', campOrdenar)
      .set(Urls.PARAM_ORDEN + 'Resp', orden);

    if (filtro) {
      params = params.set(Urls.PARAM_FILTRO + 'Resp', filtro);
    }

    return this.http
      .get<{
        actividad: Actividad,
        trabajadores: Trabajador[]
      }>(url, { observe: 'response', params: params })
      .pipe(
        map(resp => {
          let result: ItemData<ActividadCampos>;
          result = {
            codigo: CodigoApp.OK,
            data: {
              item: resp.body.actividad,
              trabajadores: {
                codigo: CodigoApp.OK,
                data: resp.body.trabajadores,
                meta: {
                  total: +resp.headers.get(Urls.HEADER_TOTAL_COUNT_SEC_RESPONSABLES)
                }
              }
            }
          };
          return result;
        }),
        catchError(this.handleError('getActividadYCampos')),
        finalize(() => {this.progressRef.complete()})
      );
  }

  /**
   * Metodo que devuelve el listado de las tareas q todavia NO se han realizado o error 
   * a traves de un Observable. 
   * El listado devuelto va a cumplir con las restricciones pasadas por parametro.
   * Retorna
   * @param pagina 
   * @param limite 
   * @param campOrdenar 
   * @param orden 
   * @param filtro 
   */
  public misNotificaciones(
    pagina: number, limite: number, campOrdenar: string = 'titulo', orden: ''|'asc' | 'desc' = 'asc', filtro: string = ''
  ): Observable<ItemData<Tarea[] | Errorr>> {
    // this.progressRef.start();
    // this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.MIS_ACTIVIDADES);
    orden = orden || "asc";
    
    let params = new HttpParams()
      .set(Urls.PARAM_PAGINA, (pagina + 1).toString());
      if(limite > 0){
        params = params.set(Urls.PARAM_LIMITE, limite.toString());
      }


    params = params
      .set(Urls.PARAM_ORDENAR_POR, campOrdenar)
      .set(Urls.PARAM_ORDEN, orden);

    if (filtro) {
      params = params.set(Urls.PARAM_FILTRO, filtro);
    }

    return this.http
      .get<Tarea[]>(`${url}/notificaciones`, { observe: 'response', params: params })
      .pipe(
        map(resp => {
          let result: ItemData<Tarea[]>;
          result = {
            codigo: CodigoApp.OK,
            data: resp.body as Tarea[],
            meta: {
              total: +resp.headers.get(Urls.HEADER_TOTAL_COUNT)
            }
          };
          return result;
        }),
        catchError(this.handleError('misNotificaciones'))
        // ,finalize(() => {this.progressRef.complete()})
      );
  }
  
}
