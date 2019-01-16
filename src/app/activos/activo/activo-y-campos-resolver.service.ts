import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ActivoCampos } from '../../acceso-datos/util/entidades/activos';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { ActivoService } from '../../acceso-datos/repos/activo.service';
import { Observable } from 'rxjs';
import { Valores } from '../../util/valores';

@Injectable({
  providedIn: 'root'
})
export class ActivoYCamposResolverService implements Resolve<ItemData<ActivoCampos|Errorr>>{

  constructor(private repo: ActivoService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ItemData<ActivoCampos | Errorr> | Observable<ItemData<ActivoCampos | Errorr>> | Promise<ItemData<ActivoCampos | Errorr>> {
    const id = route.paramMap.get('id');
    return this.repo.getActivoYCampos(+id, Valores.PAG_SIZE)
  }
}
