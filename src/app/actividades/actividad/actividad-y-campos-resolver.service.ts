import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';
import { ActividadCampos } from '../../acceso-datos/util/entidades/actividad-campos';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { ActividadService } from '../../acceso-datos/repos/actividad.service';
import { Observable } from 'rxjs';
import { Valores } from '../../util/valores';

@Injectable({
  providedIn: 'root'
})
export class ActividadYCamposResolverService implements Resolve<ItemData<ActividadCampos|Errorr>>{

  constructor(private repo: ActividadService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ItemData<ActividadCampos | Errorr> | Observable<ItemData<ActividadCampos | Errorr>> | Promise<ItemData<ActividadCampos | Errorr>> {
    const id = route.paramMap.get('id');
    return this.repo.getActividadYCampos(+id, Valores.PAG_SIZE)
  }
}
