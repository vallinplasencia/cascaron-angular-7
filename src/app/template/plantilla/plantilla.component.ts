import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../acceso-datos/seguridad/auth.service';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css'],
})
export class PlantillaComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private auth:AuthService, 
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute) { }

    /**
   * Redirecciona a la pagina de registrar usuario
   */
  registrarForm() {
    this.router.navigate([{ outlets: { primary: 'seguridad/registrar', sidebar: ['seguridad'] } }]);
  }

  /**
   * Redirecciona a la pagina de login
   */
  loginForm() {
    this.router.navigate([{ outlets: { primary: 'login', sidebar: null } }]);
  }

  /**
   * Redirecciona a la pagina de cambiar clave
   */
  cambiarClaveForm() {
    this.router.navigate([{ outlets: { primary: 'cambiar-clave', sidebar: null } }]);
  }

  /**
   * Redirecciona a la pagina de logout y desloguea al usuario
   */
  logout() {
    this.router.navigate([{ outlets: { primary: 'logout', sidebar: null } }]);
  }

  /**
   * Retorna true si el usuario esta autenticado
   */
  isAutenticado():boolean{
    return this.auth.isAutenticado();
  }

  /**
   * Retorna el nombre del usuario autenticado
   */
  nombreUsuario(){
    return this.auth.getNombreUsuario();
  }

  /**
   * Clase css q se aplica a los item de la barra superior de navegacion.
   * Tuve q crear este metodo pq parece q hay un bug y no se aplica la clase css a
   * el item de la barra superior con la directiva routerLinkActive.
   */
  aplicarClaseCss(menuPrincipal: string) {
    let url = this.router.routerState.snapshot.url;
    let aplicar = false;

    if (url.length) {
      let segmentoUrl = url.split('/');
      segmentoUrl.shift();

      if (segmentoUrl.length) {
        let segmentoInicial = segmentoUrl.shift();

        switch (menuPrincipal) {
          case 'actividades': {
            aplicar = segmentoUrl.some((segmento, idx) => {
              return (idx == 0) && (segmento.startsWith('actividad'));
            });
            break;
          }
          case 'misactividades': {
            aplicar = segmentoUrl.some((segmento, idx) => {
              return (idx == 0) && (segmento.startsWith('asignadas'));
            });
            break;
          }
          
          case 'seguridad': {
            aplicar = segmentoUrl.some((segmento, idx) => {
              return (idx == 0) && (segmento.startsWith('seguridad') || segmento.startsWith('registrar'));
            });
            break;
          }
        }
      }
    }
    return aplicar;
  }

}
