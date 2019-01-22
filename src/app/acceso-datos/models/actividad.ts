import { Categoria } from "./categoria";
import { Responsable } from "./responsable";
import { Trabajador } from "./trabajador";
import { Tarea } from "./tarea";
import { EstadosActividad } from "../util/estados-actividad.enum";

export interface Actividad{
    id?:number;
    titulo: string;
    descripcion: string;
    estado: EstadosActividad;
    fechaRegistro: Date;

    creadorPorId?: string;
    creadorPor?: Trabajador;

    asignadaAId?: string;
    asignadaA?: Trabajador;

    tareas: Tarea[];

    /**
     * Este valor unicamente lo utilizo en el listado de as actividades.
     * es solo para decir el numero de la fila. NUNCA se envia del Backend.
     */
    posicion?:number;

}