import { Component, AfterViewInit, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../acceso-datos/seguridad/auth.service';
import { MisActividadService } from '../../acceso-datos/repos/mis-actividad.service';
import { Tarea } from '../../acceso-datos/models/tarea';
import { ItemData } from '../../acceso-datos/util/entidades/item-data';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';
import { CodigoApp } from '../../acceso-datos/util/codigo-app';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css'],
})
export class PlantillaComponent implements OnInit, AfterViewInit {

  data: Tarea[] = [];
  totalItems: number;
  private misNotificSubject = new Subject();
  private subscptionMisNotif: Subscription = null;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private repoMisAct: MisActividadService,
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    console.log("ONINIT");
    //Registro el subbject para hacer las peticiones de las NOTIFICACIONES
    this.subscptionMisNotif = this.misNotificSubject
      .pipe(
        switchMap(() => {
          return this.repoMisAct
            .misNotificaciones(0, -1, 'nombre', 'asc')
        })
      ).subscribe(data => this.onSubscribe(data))
  }

  ngAfterViewInit(): void {
    console.log("afterVIEWINIT");
    //Inicio con la primera peticion para ver las notificaciones siempre q el usuario 
    //este autenticado
    if (this.auth.isAutenticado()) {
      this.misNotificSubject.next();
    }
    //Cada sierto tiempo actualizo las notificaciones por si se me asigno una nueva tarea
    setInterval(() => {

      console.log('hola');
      if (this.auth.isAutenticado()) {
        this.misNotificSubject.next();
      }

    }, 5000)

  }
  /**
   * Se utiliza en el html 
   */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches));




  /**
  * Metodo que se llama cada vez q se realiza una peticion al servidor para verificar 
  * si hay nuevas tareas sin REALIZAR.
  * @param data 
  */
  private onSubscribe(data: ItemData<Tarea[] | Errorr>) {

    switch (data.codigo) {
      case CodigoApp.OK: {
        let total = data.meta.total;
        
        if (this.totalItems != total) {
          this.totalItems = total;
          this.data = data.data as Tarea[];
        }
        break;
      }
      default: {
        console.log('ERROR AL OBTENER LA NOTIFICACIONES');
        // this.manejoError(data.codigo, data as ItemData<Errorr>)
      }
    }
  }

  /**
   * Redirecciona a la pagina de login
   */
  verMisActividades() {
    this.router.navigate([{ outlets: { primary: 'mis-actividades/asignadas', sidebar: 'misactividad' } }]);
  }


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
  isAutenticado(): boolean {
    return this.auth.isAutenticado();
  }

  /**
   * Retorna el nombre del usuario autenticado
   */
  nombreUsuario() {
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
