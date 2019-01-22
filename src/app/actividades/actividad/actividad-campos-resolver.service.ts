import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';
import { ActividadCampos } from '../../acceso-datos/util/entidades/actividad-campos';
import { ActividadService } from '../../acceso-datos/repos/actividad.service';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { Observable } from 'rxjs';
import { Valores } from '../../util/valores';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActividadCamposResolverService implements Resolve<ItemData<ActividadCampos|Errorr>>{

  constructor(private repo: ActividadService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ItemData<ActividadCampos | Errorr> | Observable<ItemData<ActividadCampos | Errorr>> | Promise<ItemData<ActividadCampos | Errorr>> {
    return this.repo
      .getActividadCampos(Valores.PAG_SIZE)
      .pipe(
        take(1)
      );
  }
}
