/**
 * Interface que representa generalmente la estructura de los datos provenietes de una 
 * peticion http. 
 * 
 * T - Tipo que cumple con los datos concretamente. 
 * Puede ser una entidad o arreglo de una entidad, error de validacion o error general
 * 
 * - codigo: Codigo q tiene el error. Ver clase util/http/codigo-app.
 * - data: Datos devueltos
 * 
 * Ejemplo:
 * 
 * Datos entidad:
 * {codigo: 200, data: {nombre: 'vallin', apellido: 'plasencia'}}
 * 
 * 
 * Datos error de validacion:
 * {codigo: 400, data: {nombre: ['Nombre obligatorio', '....']}}
 * 
 * 
 * Datos error generales(red o cliente):
 * {codigo: 500, data: {_: ['Error de red', '....']}}
 */
export interface ItemData<T> {
    /**
     * Va a contener los datos devueltos por el servidor.
     * - T - Una entidad o una arreglo de entidades.
     */
    data: T;
    /**
     * Codigo devuelto por el servidor. Ver clase util/http/codigo-app
     */
    codigo?: number;

    //********Los siguientes datos estan solo en los listar q estan paginados.****//
    
    
}
