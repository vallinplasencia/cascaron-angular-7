import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../acceso-datos/seguridad/auth.service';
import { MatSnackBar } from '@angular/material';
import { Util } from '../util';

@Injectable({
  providedIn: 'root'
})
export class RoleAutorizarGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const roles = next.data["roles"] as Array<string>;

    //Si no esta protegida esa ruta con roles se le da autorizacion.
    if (!roles) {
      return true;
    }
    
    if (!this.auth.tieneRole(roles)) {
      if (this.auth.isAutenticado()) {
        this.snackBar.open(
          'No tiene acceso para acceder a la página solicitada.',
          'X',
          {
            duration: Util.SNACKBAR_DURACION_INFORMACION
          });
          this.router.navigate([{ outlets: { primary: null, sidebar: null } }]);
      } else {
        // this.auth.redireccionarUrl = state.url;
        this.router.navigate([{ outlets: { primary: 'login', sidebar: null } }]);
      }
      return false;
    }
    return true;
  }
}
