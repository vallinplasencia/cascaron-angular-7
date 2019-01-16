import { Categoria } from "../../models/categoria";
import { Responsable } from "../../models/responsable";
import { ItemData } from "./item-data";
import { Activo } from "../../models/activo";

/**
 * Interfaz usada cuando se va a dar de alta o midificar un Item.
 * Esta interfaz contiene los datos q se cargan del Backend para poder llenar 
 * algunos campos del Item.
 * 
 * En caso de utilizarce esta interfaz para modificar un item ademas de los 
 * datos para los campos q se llenan del backend tambien contiene 
 * el propio item a modificar.
 */
export interface ActivoCampos {
    /**
     * Item a modificar. Este campo solo se utiliza si esta interfaz se emplea para
     * modificar un item
     */
    item?: Activo;
    /**
     * Un arreglo de items q los voy a mostrar en un select.
     */
    categorias: Categoria[];
    
    /**
     * Un arreglo de item contenido dentro de un ITEMDATA. 
     * Utilizo ItemData pq necesito paginado pues son muchos items.
     * Se utiliza en un mat-table
     */
    responsables: ItemData<Responsable[]>;
}
