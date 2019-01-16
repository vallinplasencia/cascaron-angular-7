import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Interface q permite q se le pueda aplicar este deactivate a 
 * cualquier componetente lo q lo hace reusable.
 */
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | boolean;
 }

 /**
  * Deactivate reusable para cualquier componente.
  */
@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  
  canDeactivate(
    component: CanComponentDeactivate, 
    currentRoute: ActivatedRouteSnapshot, 
    currentState: RouterStateSnapshot, 
    nextState?: RouterStateSnapshot): boolean | Observable<boolean>{
    return component.canDeactivate ? component.canDeactivate() : true;
  }
  
}
