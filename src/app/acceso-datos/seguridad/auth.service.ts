import { Injectable } from '@angular/core';
import { Util } from '../../util/util';
import { Observable } from 'rxjs';
import { ItemData } from '../util/entidades/item-data';
import { Errorr } from '../util/entidades/errorr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiErrorHandlerService, HandleError } from '../error/api-error-handler.service';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { Urls } from '../util/urls';
import { map, catchError, finalize } from 'rxjs/operators';
import { CodigoApp } from '../util/codigo-app';
import { UsuarioAuth } from '../util/entidades/usuario-auth';


// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class AuthService {

  private handleError: HandleError;
  private progressRef: NgProgressRef;

  /**
   * Contiene la url a la q el usuario desea navegar y no tiene acceso a esta
   * url. Primero tiene que Loguearse
   */
  public redireccionarUrl: string = null;

  constructor(
    private http: HttpClient,
    httpErrorHandler: ApiErrorHandlerService,
    private progress: NgProgress
  ) {
    this.handleError = httpErrorHandler.createHandleError('AuthService');
    this.progressRef = this.progress.ref();
  }

  /**
   * Autentica el usuario
   * @param usuario 
   * @param clave 
   */
  public login(usuario: string, clave: string): Observable<ItemData<UsuarioAuth | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);
    let url = Urls.crearUrl(Urls.TOKEN);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };
    const datosLogin = `Username=${usuario}&Password=${clave}&grant_type=password`;
    return this.http
      .post<UsuarioAuth>(url, datosLogin, httpOptions)
      .pipe(
        map(resp => {
          let result: ItemData<UsuarioAuth>;
          result = {
            codigo: CodigoApp.OK,
            data: {
              access_token: resp.access_token,
              token_type: resp.token_type,
              expires_in: resp.expires_in,
              userName: resp.userName,
              rolesCadena: resp.rolesCadena,
              //Desde el Backend lo q puedo retornar es una cadena de texto.
              //No pude retorna un arreglo con los roles. Sino lo q pude retorna 
              //es un string con el formato de arreglo por lo q tengo q convertirlo
              //a un arreglo
              roles: JSON.parse(resp.rolesCadena),
              issued: new Date(resp[".issued"]),
              expires: new Date(resp[".expires"])
            }
          };
          return result;
        }),
        catchError(this.handleError('login')),
        finalize(() => this.progressRef.complete())
      );
  }

  /**
   * Desloguear al usuario autenticado
   */
  public logout(): Observable<ItemData<{} | Errorr>> {
    this.progressRef.start();
    //Pongo esto pues cuando se navega a una url mientras otra no se ha completado
    //aunque la q no se ha completado me unsubscriva de su observable y por ende 
    //se ejecuta el metodo finalize del observable y dentro de este se llama al
    //metodo progressRef.complete() la barra de progreso no se inicia se continua 
    //mostrando por donde estaba en el momento de unbsubscribirme de la peticion anterior. 
    this.progressRef.set(0);
    let url = Urls.crearUrl(`${Urls.ACCOUNT}/logout`);

    return this.http
      .post<{}>(url, {})
      .pipe(
        map(resp => {
          let result: ItemData<{}>;
          result = {
            codigo: CodigoApp.OK,
            data: {}
          };
          return result;
        }),
        catchError(this.handleError('logout')),
        finalize(() => this.progressRef.complete())
      );
  }

  /**
   * Si el usuario esta autenticado retorna el usuario autenticado con varios 
   * datos incluyendo el token. Si no se encuentra autenticado retorna NULL.
   */
  public getUsuarioAuth(): UsuarioAuth {
    if (localStorage.getItem(Util.STORAGE_GUARDAR_CREDENCIALES)) {
      return JSON.parse(localStorage.getItem(Util.STORAGE_DATOS_USUARIO_AUTH));
    }
    return JSON.parse(sessionStorage.getItem(Util.STORAGE_DATOS_USUARIO_AUTH));
  }

  /**
   * Guarda los datos del usuario autenticado incluyendo el token.
   * Si todo fue bien retorna TRUE sino False.
   */
  public salvarUsuarioAuth(datosUsuarioAuth: UsuarioAuth): boolean {
    if (Util.isObjVacio(datosUsuarioAuth)) {
      return false;
    }
    if (localStorage.getItem(Util.STORAGE_GUARDAR_CREDENCIALES)) {
      localStorage.setItem(Util.STORAGE_DATOS_USUARIO_AUTH, JSON.stringify(datosUsuarioAuth));
    } else {
      sessionStorage.setItem(Util.STORAGE_DATOS_USUARIO_AUTH, JSON.stringify(datosUsuarioAuth));
    }
    return true;
  }

  /**
   * Elimina los datos del usuario autenticado incluyendo el token.
   * Si todo fue bien retorna TRUE sino False.
   */
  public removerUsuarioAuth(): void {
    if (localStorage.getItem(Util.STORAGE_GUARDAR_CREDENCIALES)) {
      localStorage.removeItem(Util.STORAGE_DATOS_USUARIO_AUTH);
    } else {
      sessionStorage.removeItem(Util.STORAGE_DATOS_USUARIO_AUTH);
    }
    localStorage.removeItem(Util.STORAGE_GUARDAR_CREDENCIALES);
  }

  /**
   * Retorna TRUE si el usuario esta autenticado, False en caso contrario
   */
  public isAutenticado(): boolean {
    return this.getUsuarioAuth() ? true : false;
  }

  /**
   * Retorna el nombre de usuario del usuario autenticado o NULL en caso contrario.
   */
  public getNombreUsuario(): string {
    const usuario = this.getUsuarioAuth();
    return usuario ? usuario.userName.substring(0, usuario.userName.indexOf("@")) : null;
  }

  /**
   * Retorna un arreglo con los roles del usuario o un array vacio si no tiene roles.
   */
  public getRoles(): string[] {
    const usuario = this.getUsuarioAuth();
    return usuario ? usuario.roles : [];
  }

  /**
   * Retorna TRUE si el usuario autenticado tiene el role o alguno de los roles
   * pasado por parametro en caso contrario retorna FALSE.
   * 
   * @param role Un role(string) o un arreglo de roles(string) a verificar si
   * por lo menos uno de ellos esta presente en los roles del usuario autenticado.
   */
  public tieneRole(roles: string | string[] = []): boolean {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }
    const roless = roles.map(r => r.toLowerCase());
    return this.getRoles().some(rg => {
      const rlc = rg.toLowerCase();
      return roless.some(r => r == rlc)
    });
  }

}
