import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { ActivoService } from '../../acceso-datos/repos/activo.service';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { Activo } from '../../acceso-datos/models/activo';

@Injectable({
  providedIn: 'root'
})
export class ActivoResolverService implements Resolve<ItemData<Activo|Errorr>>{

  constructor(
    private categoriaRepo: ActivoService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ItemData<Activo|Errorr>>|Observable<never> {
      const id = route.paramMap.get('id');
  
      return this.categoriaRepo.getActivo(id).pipe(
        take(1)
      );
    }
}
