import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiErrorHandlerService, HandleError } from '../error/api-error-handler.service';
import { Observable } from 'rxjs';
import { Trabajador } from '../models/trabajador';
import { Errorr } from '../util/entidades/errorr';
import { ItemData } from '../util/entidades/item-data';
import { Urls } from '../util/urls';
import { catchError, map, finalize } from 'rxjs/operators';
import { CodigoApp } from '../util/codigo-app';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {

  private handleError: HandleError;
  private progressRef: NgProgressRef;

  constructor(
    private http: HttpClient,
    httpErrorHandler: ApiErrorHandlerService,
    private progress: NgProgress
  ) {
    this.handleError = httpErrorHandler.createHandleError('TrabajadorService');
    this.progressRef = this.progress.ref();
  }

  /**
   * Metodo que devuelve el listado de las trabajadores p error a traves de un Observable. 
   * El listado devuelto va a cumplir con las restricciones pasadas por parametro.
   * @param pagina Numero de la pagina.
   * @param limite Cantidad de items a retornar
   * @param campOrdenar Campo por el q se va a ordenar el resultado. Opcional.
   * @param orden Orden q va a seguir el listado. Puede ser ASC o DESC.
   * @param filtro Campo q va a filtrar los resultados
   * @returns Observable<ItemData<Trabajador[] | Errorr>> Rerona un observable q puede emitir
   * un ItemData con un arreglo de trabajador si todo ocurrio normalmente o un ItemData con 
   * un Errorr si ocurrio algun problema de red o error en el server ...
   */
  public index(
    pagina: number, limite: number, campOrdenar: string = 'nombre', orden: ''|'asc' | 'desc' = 'asc', filtro: string = ''
  ): Observable<ItemData<Trabajador[] | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.TRABAJADORES);
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
      .get<Trabajador[]>(url, { observe: 'response', params: params })
      .pipe(
        map(resp => {
          let result: ItemData<Trabajador[]>;
          result = {
            codigo: CodigoApp.OK,
            data: resp.body as Trabajador[],
            meta: {
              total: +resp.headers.get(Urls.HEADER_TOTAL_COUNT)
            }
          };
          return result;
        }),
        catchError(this.handleError('index')),
        finalize(() => this.progressRef.complete())
      );
  }

  public salvar(trabajador: Trabajador, id: number = -1): Observable<ItemData<Trabajador | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);
    let url = Urls.crearUrl(Urls.TRABAJADORES);

    if (id == -1) {
      return this.http
        .post<Trabajador>(url, trabajador)
        .pipe(
          map(resp => {
            let result: ItemData<Trabajador>;
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
      .put(`${url}/${id}`, trabajador)
      .pipe(
        map(resp => {
          let result: ItemData<Trabajador>;
          result = {
            codigo: CodigoApp.OK,
            data: trabajador
          };
          return result;
        }),
        catchError(this.handleError('salvar_actualizar')),
        finalize(() => this.progressRef.complete())
      );
  }

  public getTrabajador(id: number | string): Observable<ItemData<Trabajador | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.TRABAJADORES);
    return this.http
      .get<Trabajador>(`${url}/${id}`)
      .pipe(
        map(resp => {
          let result: ItemData<Trabajador>;
          result = {
            codigo: CodigoApp.OK,
            data: resp as Trabajador
          };
          return result;
        }),
        catchError(this.handleError('getTrabajador')),
        finalize(() => this.progressRef.complete())
      );
  }

  public eliminar(id: number | string): Observable<ItemData<Trabajador | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.TRABAJADORES);

    return this.http
      .delete<Trabajador>(`${url}/${+id}`)
      .pipe(
        map(resp => {
          let result: ItemData<Trabajador>;
          result = {
            codigo: CodigoApp.OK,
            data: resp as Trabajador
          };
          return result;
        }),
        catchError(this.handleError('eliminar')),
        finalize(() => this.progressRef.complete())
      );;
  }
}
