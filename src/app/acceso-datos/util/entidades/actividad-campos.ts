import { ItemData } from "./item-data";
import { Actividad } from "../../models/actividad";
import { Trabajador } from "../../models/trabajador";

/**
 * Interfaz usada cuando se va a dar de alta o midificar un Item.
 * Esta interfaz contiene los datos q se cargan del Backend para poder llenar 
 * algunos campos del Item.
 * 
 * En caso de utilizarce esta interfaz para modificar un item ademas de los 
 * datos para los campos q se llenan del backend tambien contiene 
 * el propio item a modificar.
 */
export interface ActividadCampos {
    /**
     * Item a modificar. Este campo solo se utiliza si esta interfaz se emplea para
     * modificar un item
     */
    item?: Actividad;
    
    /**
     * Un arreglo de item contenido dentro de un ITEMDATA. 
     * Utilizo ItemData pq necesito paginado pues son muchos items.
     * Se utiliza en un mat-table
     */
    trabajadores: ItemData<Trabajador[]>;
}
