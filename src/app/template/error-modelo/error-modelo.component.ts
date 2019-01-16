import { Component, OnInit, Input } from '@angular/core';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';

@Component({
  selector: 'app-error-modelo',
  templateUrl: './error-modelo.component.html',
  styleUrls: ['./error-modelo.component.css']
})
export class ErrorModeloComponent implements OnInit {
  @Input() errores: Errorr;

  mostrar = true;

  constructor() { }

  ngOnInit() {
  }

  ocultarMensajes(){
    this.mostrar = false;
  }

}
