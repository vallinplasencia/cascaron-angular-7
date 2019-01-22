import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';
import { Actividad } from '../../acceso-datos/models/actividad';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { ActividadService } from '../../acceso-datos/repos/actividad.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActividadResolverService implements Resolve<ItemData<Actividad|Errorr>>{

  constructor(
    private categoriaRepo: ActividadService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ItemData<Actividad|Errorr>>|Observable<never> {
      const id = route.paramMap.get('id');
  
      return this.categoriaRepo.getActividad(id).pipe(
        take(1)
      );
    }
}
