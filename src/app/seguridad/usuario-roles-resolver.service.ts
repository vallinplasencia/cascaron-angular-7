import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ItemData } from '../acceso-datos/util/entidades/item-data';
import { Errorr } from '../acceso-datos/util/entidades/errorr';
import { AccountService } from '../acceso-datos/seguridad/account.service';
import { Observable } from 'rxjs';
import { Valores } from '../util/valores';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioRolesResolverService implements Resolve<ItemData<string[]|Errorr>>{

  constructor(private repo: AccountService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ItemData<string[] | Errorr> | Observable<ItemData<string[] | Errorr>> | Promise<ItemData<string[] | Errorr>> {
    return this.repo
      .getTodosLosRoles(Valores.PAG_SIZE)
      .pipe(
        take(1)
      );
  }
}
