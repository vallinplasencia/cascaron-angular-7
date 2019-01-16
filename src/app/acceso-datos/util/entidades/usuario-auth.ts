import { Categoria } from "../../models/categoria";
import { Responsable } from "../../models/responsable";
import { ItemData } from "./item-data";
import { Activo } from "../../models/activo";

/**
 * Interfaz usada cuando se autentica un usuario.
 * 
 * Contiene todos los datos devueltos por el servidor al autenticarse un usuario
 */
export interface UsuarioAuth {
    /**
     * cadena que contiene el token de acceso cuando un usuario se autentica
     */
    access_token: string;
    /**
     * Tipo de token. En este caso siempre retorna bearer
     */
    token_type: string;

    /**
     * Nombre de usuario del usuario autenticado
     */
    userName: string;

    /**
     * Cadena de texto con todos los roles. Viene del servidor.
     * Formato de la cadena: "["Admin", "SuperAdmin", "..."]".
     * Hago esto como una cadena pq no pude retornar desde el Backend 
     * un arreglo de roles
     */
    rolesCadena: string;

    /**
     * Roles del usuario. 
     * Arreglo de roles despues de convertir la propiedad rolesCadena.
     * Hago esto pq no pude retornar desde el Backend una arreglo de roles.
     * Cuando recibo la response convierto la cadena a un arreglo de roles.
     */
    roles?: string[];

    /**
         * Numero de milesegundo en q expira el token
         */
    expires_in: number;

    /**
     * Fecha en la q se emito el token.
     */
    issued: Date;

    /**
     * Fecha en la q expira el token
     */
    expires: Date;

}
