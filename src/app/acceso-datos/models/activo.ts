import { Categoria } from "./categoria";
import { Responsable } from "./responsable";

export interface Activo{
    id?:number;
    nombre: string;
    unidades: number; 
    esPrincipal: boolean;
    fechaAlta?: Date;
    fechaBaja?: Date;

    categoria?: Categoria;
    categoriaId?: string;

    responsable?: Responsable;
    responsableId?: string;

}