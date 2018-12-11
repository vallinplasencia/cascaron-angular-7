import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemData } from '../util/entidades/item-data';
import { Errorr } from '../util/entidades/errorr';
import { Observable, of } from 'rxjs';
import { Util } from '../../util/util';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlerService {

  constructor() { }
  /** Create curried handleError function that already knows the service name */
  createHandleError = (serviceName = '') =>
    (operation = 'operation',result = {} as ItemData<Errorr>) => this.handleError(serviceName, operation, result);

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
      let msj:string;

      if(error.error instanceof ErrorEvent){
        msj = 'Error en el cliente o en la red. '+error.error.message ;
      }else{
        if(error.status){
          msj = `Error del servidor: Código: ${error.status}. Mensaje: "${error.message}"`;
        }else{
          msj = 'Existen problemas de conexión con el servidor.';
        }
        
      }
      if(Util.isObjVacio(result)){
        return of({codigo: 500, data:{'_': [msj]}});
      }
      // Let the app keep running by returning a safe result.

      return of(result);
    };

  }
}
