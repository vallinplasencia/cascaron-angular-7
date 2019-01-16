import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ActivoCampos } from '../../acceso-datos/util/entidades/activo-campos';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivoService } from '../../acceso-datos/repos/activo.service';
import { Valores } from '../../util/valores';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';

@Injectable({
  providedIn: 'root'
})
export class ActivoCamposResolverService implements Resolve<ItemData<ActivoCampos|Errorr>>{

  constructor(private repo: ActivoService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ItemData<ActivoCampos | Errorr> | Observable<ItemData<ActivoCampos | Errorr>> | Promise<ItemData<ActivoCampos | Errorr>> {
    return this.repo
      .getActivoCampos(Valores.PAG_SIZE)
      .pipe(
        take(1)
      );
  }
}
