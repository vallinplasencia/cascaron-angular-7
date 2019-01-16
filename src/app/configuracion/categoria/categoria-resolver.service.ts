import { Injectable } from '@angular/core';
import { CategoriaService } from '../../acceso-datos/repos/categoria.service';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';
import { Categoria } from '../../acceso-datos/models/categoria';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriaResolverService implements Resolve<ItemData<Categoria|Errorr>>{

  constructor(
    private categoriaRepo: CategoriaService,
    private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ItemData<Categoria|Errorr>>|Observable<never> {
      let id = route.paramMap.get('id');
  
      return this.categoriaRepo.getCategoria(id).pipe(
        take(1)
      );
    }
}
