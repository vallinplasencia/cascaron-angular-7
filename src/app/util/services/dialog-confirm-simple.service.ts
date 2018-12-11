import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogConfirmSimpleService {

  constructor() { }
  /**
   * Retona un Observable<boolean>, True si si confirmo y Falso si se cancelo.
   * 
   * @param message Mensaje a mostrar en la ventanita de confirmacion.
   */
  confirm(message?: string): Observable<boolean> {
    const confirmation = window.confirm(message || 'Está todo OK?');
    
    return of(confirmation);
  };
}
