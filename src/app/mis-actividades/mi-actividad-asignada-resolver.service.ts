import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MisActividadService } from '../acceso-datos/repos/mis-actividad.service';
import { ItemData } from '../acceso-datos/util/entidades/item-data';
import { Actividad } from '../acceso-datos/models/actividad';
import { Errorr } from '../acceso-datos/util/entidades/errorr';

@Injectable({
  providedIn: 'root'
})
export class MiActividadAsignadaResolverService implements Resolve<ItemData<Actividad|Errorr>>{

  constructor(
    private categoriaRepo: MisActividadService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ItemData<Actividad|Errorr>>|Observable<never> {
      const id = route.paramMap.get('id');
  
      return this.categoriaRepo.getActividadAsignada(id).pipe(
        take(1)
      );
    }
}
