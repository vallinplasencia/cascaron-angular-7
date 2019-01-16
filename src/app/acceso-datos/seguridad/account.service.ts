import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiErrorHandlerService, HandleError } from '../error/api-error-handler.service';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Errorr } from '../util/entidades/errorr';
import { ItemData } from '../util/entidades/item-data';
import { Urls } from '../util/urls';
import { catchError, map, finalize } from 'rxjs/operators';
import { CodigoApp } from '../util/codigo-app';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private handleError: HandleError;
  private progressRef: NgProgressRef;

  constructor(
    private http: HttpClient,
    httpErrorHandler: ApiErrorHandlerService,
    private progress: NgProgress
  ) {
    this.handleError = httpErrorHandler.createHandleError('UsuarioService');
    this.progressRef = this.progress.ref();
  }

  /**
   * Metodo que devuelve el listado de las usuarios p error a traves de un Observable. 
   * El listado devuelto va a cumplir con las restricciones pasadas por parametro.
   * @param pagina Numero de la pagina.
   * @param limite Cantidad de items a retornar
   * @param campOrdenar Campo por el q se va a ordenar el resultado. Opcional.
   * @param orden Orden q va a seguir el listado. Puede ser ASC o DESC.
   * @param filtro Campo q va a filtrar los resultados
   * @returns Observable<ItemData<Usuario[] | Errorr>> Rerona un observable q puede emitir
   * un ItemData con un arreglo de usuario si todo ocurrio normalmente o un ItemData con 
   * un Errorr si ocurrio algun problema de red o error en el server ...
   */
  public index(
    pagina: number, limite: number, campOrdenar: string = 'nombre', orden: ''|'asc' | 'desc' = 'asc', filtro: string = ''
  ): Observable<ItemData<Usuario[] | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.ACCOUNT);
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
      .get<Usuario[]>(url, { observe: 'response', params: params })
      .pipe(
        map(resp => {
          let result: ItemData<Usuario[]>;
          result = {
            codigo: CodigoApp.OK,
            data: resp.body as Usuario[],
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

  public salvar(usuario: any, id: number = -1): Observable<ItemData<Usuario | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);
    let url = Urls.crearUrl(Urls.ACCOUNT+"/register");

    if (id == -1) {
      return this.http
        .post<Usuario>(url, usuario)
        .pipe(
          map(resp => {
            let result: ItemData<Usuario>;
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
      .put(`${url}/${id}`, usuario)
      .pipe(
        map(resp => {
          let result: ItemData<Usuario>;
          result = {
            codigo: CodigoApp.OK,
            data: usuario
          };
          return result;
        }),
        catchError(this.handleError('salvar_actualizar')),
        finalize(() => this.progressRef.complete())
      );
  }

  public getUsuario(id: number | string): Observable<ItemData<Usuario | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.ACCOUNT);
    return this.http
      .get<Usuario>(`${url}/${id}`)
      .pipe(
        map(resp => {
          let result: ItemData<Usuario>;
          result = {
            codigo: CodigoApp.OK,
            data: resp as Usuario
          };
          return result;
        }),
        catchError(this.handleError('getUsuario')),
        finalize(() => this.progressRef.complete())
      );
  }

  public eliminar(id: number | string): Observable<ItemData<Usuario | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(Urls.ACCOUNT);

    return this.http
      .delete<Usuario>(`${url}/${+id}`)
      .pipe(
        map(resp => {
          let result: ItemData<Usuario>;
          result = {
            codigo: CodigoApp.OK,
            data: resp as Usuario
          };
          return result;
        }),
        catchError(this.handleError('eliminar')),
        finalize(() => this.progressRef.complete())
      );;
  }

  /**
   * Cambia la clave del usuario autenticado.
   * @param data
   */
  public cambiarClave(data: any): Observable<ItemData<boolean | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);
    let url = Urls.crearUrl(Urls.ACCOUNT+"/ChangePassword");

      return this.http
        .post<{}>(url, data)
        .pipe(
          map(resp => {
            let result: ItemData<boolean>;
            result = {
              codigo: CodigoApp.OK,
              data: true
            };
            return result;
          }),
          catchError(this.handleError('cambiar_clave')),
          finalize(() => this.progressRef.complete())
        );
  }

  /**
   * Obtiene todo los ROLES q se le pueden asignar a un usuario. Es decir estos
   * valores de los roles se cargan del backend.
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
  public getTodosLosRoles(limite: number, pagina: number = 1, campOrdenar: string = 'nombre', orden: '' | 'asc' | 'desc' = 'asc', filtro: string = ''
  ): Observable<ItemData<string[] | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);

    let url = Urls.crearUrl(`${Urls.ACCOUNT}/todos-roles`);
    orden = orden || "asc";

    let params = new HttpParams()
      .set(Urls.PARAM_PAGINA + 'Role', pagina.toString())
      .set(Urls.PARAM_LIMITE + 'Role', limite.toString());
    
    params = params
      .set(Urls.PARAM_ORDENAR_POR + 'Role', campOrdenar)
      .set(Urls.PARAM_ORDEN + 'Role', orden);

    if (filtro) {
      params = params.set(Urls.PARAM_FILTRO + 'Role', filtro);
    }

    return this.http
      .get<string[]>(url, {params: params })
      .pipe(
        map(resp => {
          let result: ItemData<string[]>;
          result = {
            codigo: CodigoApp.OK,
            data: resp
          };
          return result;
        }),
        catchError(this.handleError('getTodosLosRoles')),
        finalize(() => this.progressRef.complete())
      );
  }
}
