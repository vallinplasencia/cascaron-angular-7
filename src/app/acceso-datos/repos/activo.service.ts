import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiErrorHandlerService, HandleError } from '../error/api-error-handler.service';
import { Observable } from 'rxjs';
import { Activo } from '../models/activo';
import { Errorr } from '../util/entidades/errorr';
import { ItemData } from '../util/entidades/item-data';
import { Urls } from '../util/urls';
import { catchError, map, finalize } from 'rxjs/operators';
import { CodigoApp } from '../util/codigo-app';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { ActivoCampos } from '../util/entidades/activo-campos';
import { Categoria } from '../models/categoria';
import { Responsable } from '../models/responsable';

@Injectable({
  providedIn: 'root'
})
export class ActivoService {

  private handleError: HandleError;
  private progressRef: NgProgressRef;

  constructor(
    private http: HttpClient,
    httpErrorHandler: ApiErrorHandlerService,
    private progress: NgProgress
  ) {
    this.handleError = httpErrorHandler.createHandleError('ActivoService');
    this.progressRef = this.progress.ref();
  }

  /**
   * Metodo que devuelve el listado de las activos p error a traves de un Observable. 
   * El listado devuelto va a cumplir con las restricciones pasadas por parametro.
   * @param pagina Numero de la pagina.
   * @param limite Cantidad de items a retornar
   * @param campOrdenar Campo por el q se va a ordenar el resultado. Opcional.
   * @param orden Orden q va a seguir el listado. Puede ser ASC o DESC.
   * @param filtro Campo q va a filtrar los resultados
   * @returns Observable<ItemData<Activo[] | Errorr>> Rerona un observable q puede emitir
   * un ItemData con un arreglo de activo si todo ocurrio normalmente o un ItemData con 
   * un Errorr si ocurrio algun problema de red o error en el server ...
   */
  public index(
    pagina: number, limite: number, campOrdenar: string = 'nombre', orden: ''|'asc' | 'desc' = 'asc', filtro: string = ''
  ): Observable<ItemData<Activo[] | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.ACTIVOS);
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
      .get<Activo[]>(url, { observe: 'response', params: params })
      .pipe(
        map(resp => {
          let result: ItemData<Activo[]>;
          result = {
            codigo: CodigoApp.OK,
            data: resp.body as Activo[],
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

  public salvar(activo: Activo, id: number = -1): Observable<ItemData<Activo | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);
    let url = Urls.crearUrl(Urls.ACTIVOS);

    if (id == -1) {
      return this.http
        .post<Activo>(url, activo)
        .pipe(
          map(resp => {
            let result: ItemData<Activo>;
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
      .put(`${url}/${id}`, activo)
      .pipe(
        map(resp => {
          let result: ItemData<Activo>;
          result = {
            codigo: CodigoApp.OK,
            data: activo
          };
          return result;
        }),
        catchError(this.handleError('salvar_actualizar')),
        finalize(() => this.progressRef.complete())
      );
  }

  public getActivo(id: number | string): Observable<ItemData<Activo | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.ACTIVOS);
    return this.http
      .get<Activo>(`${url}/${id}`)
      .pipe(
        map(resp => {
          let result: ItemData<Activo>;
          result = {
            codigo: CodigoApp.OK,
            data: resp as Activo
          };
          return result;
        }),
        catchError(this.handleError('getActivo')),
        finalize(() => this.progressRef.complete())
      );
  }

  public eliminar(id: number | string): Observable<ItemData<Activo | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.ACTIVOS);

    return this.http
      .delete<Activo>(`${url}/${+id}`)
      .pipe(
        map(resp => {
          let result: ItemData<Activo>;
          result = {
            codigo: CodigoApp.OK,
            data: resp as Activo
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
  public getActivoCampos(limite: number, pagina: number = 1, campOrdenar: string = 'nombre', orden: '' | 'asc' | 'desc' = 'asc', filtro: string = ''
  ): Observable<ItemData<ActivoCampos | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.ACTIVOS_CAMPOS);
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
        categorias: Categoria[],
        responsables: Responsable[]
      }>(url, { observe: 'response', params: params })
      .pipe(
        map(resp => {
          let result: ItemData<ActivoCampos>;
          result = {
            codigo: CodigoApp.OK,
            data: {
              categorias: resp.body.categorias,
              responsables: {
                codigo: CodigoApp.OK,
                data: resp.body.responsables,
                meta: {
                  total: +resp.headers.get(Urls.HEADER_TOTAL_COUNT_SEC_RESPONSABLES)
                }
              }
            }
          };
          return result;
        }),
        catchError(this.handleError('getActivoCampos')),
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
  public getActivoYCampos(id: number, limite: number, pagina: number = 1, campOrdenar: string = 'nombre', orden: '' | 'asc' | 'desc' = 'asc', filtro: string = ''
  ): Observable<ItemData<ActivoCampos | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(`${Urls.ACTIVOS_Y_CAMPOS}/${id}`);
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
        activo: Activo,
        categorias: Categoria[],
        responsables: Responsable[]
      }>(url, { observe: 'response', params: params })
      .pipe(
        map(resp => {
          let result: ItemData<ActivoCampos>;
          result = {
            codigo: CodigoApp.OK,
            data: {
              item: resp.body.activo,
              categorias: resp.body.categorias,
              responsables: {
                codigo: CodigoApp.OK,
                data: resp.body.responsables,
                meta: {
                  total: +resp.headers.get(Urls.HEADER_TOTAL_COUNT_SEC_RESPONSABLES)
                }
              }
            }
          };
          return result;
        }),
        catchError(this.handleError('getActivoYCampos')),
        finalize(() => {this.progressRef.complete()})
      );
  }
}
