import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemData } from '../util/entidades/item-data';
import { Errorr } from '../util/entidades/errorr';
import { Observable, of } from 'rxjs';
import { Util } from '../../util/util';
import { CodigoApp } from '../util/codigo-app';


/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError =
  (operation?: string, result?: ItemData<Errorr>) => (error: HttpErrorResponse) => Observable<ItemData<Errorr>>;
// export type HandleError =
//   <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;



@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlerService {

  constructor() { }
  /** Create curried handleError function that already knows the service name */
  createHandleError = (serviceName = '') =>
    (operation = 'operation', result = {} as ItemData<Errorr>) => this.handleError(serviceName, operation, result);

  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * @param serviceName = name of the data service that attempted the operation
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   * 
   * @returns Observable<{}|T> - Objeto a retornar.
   */
  handleError(serviceName = '', operation = 'operation', result = {} as ItemData<Errorr>) {

    return (error: HttpErrorResponse): Observable<ItemData<Errorr>> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // const message = (error.error instanceof ErrorEvent) ?
      //   'Error en el cliente o de red. '+error.error.message :
      //   `Error del servidor. Código: ${error.status}. Mensaje: "${error.error}"`;
      let msj: string = "Estamos presentando problemas. Inténtelo mas tarde.";

      if (error.error instanceof ErrorEvent) {
        msj = 'Error en el cliente o en la red. ' + error.error.message;
      } else {
        switch ((error.status ? error.status : -1)) {
          case 400:
            if (Util.isObjVacio(error.error)) {
              //Si ocurrio un error sin contenido
              result = { codigo: CodigoApp.ERROR_PETICION_INCORRECTA_GENERAL, data: { "errores": ["Petición incorrecta"] } };
            
            } else {
              //Si ocurrio un error al autenticar el usuario. 
              //Este invalid_grant lo retorna ASP.NET Identity con Owin
              if(error.error.error == "invalid_grant"){ 
                
                result = { codigo: CodigoApp.ERROR_AUTENTICACION_FALLA, data: { "error": [error.error.error_description] } };
              
              }else{
                //Errores de validacion
                result = { codigo: CodigoApp.ERROR_VALIDACION, data: error.error.modelState };
              }
              
              // result = { codigo: CodigoApp.ERROR_VALIDACION, data: error.error };
            }
            break;
          case 401:
            result = { codigo: CodigoApp.ERROR_UNAUTHORIZED, data: { "errores": ["No tiene permisos para acceder al recurso solicitado"] } };
            break;  
          case 404:
            result = { codigo: CodigoApp.ERROR_NO_ENCONTRADO, data: { "errores": ["No se encuentra el recurso solicitado"] } };
            break;
          case 500:
            result = { codigo: CodigoApp.ERROR_INESPERADO, data: { "errores": ["Error interno del servidor"] } };
            break;
          case -1:
            result = { codigo: CodigoApp.ERROR_SIN_CONEXION, data: { "errores": ["Problemas de conexión con el servidor o error desconocido"] } };
            break;
          default:
            result = { codigo: CodigoApp.ERROR_GENERAL, data: { "errores": ["Error inesperado"] } };
        }
      }
      if (Util.isObjVacio(result)) {
        return of({ codigo: CodigoApp.ERROR_GENERAL, data: { 'errores': [msj] } });
      }
      return of(result);
    };

  }
}
