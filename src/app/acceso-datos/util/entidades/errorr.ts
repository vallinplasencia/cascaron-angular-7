/**
 * Interface que representa la estructura de los errores provenietes de una 
 * peticion http.
 * 
 * Generalmete errores de validacion de los modelos. 
 * 
 * Aunque tambien esta interface puede representar errore del lado del cliente o 
 * errores con la red. En dicho caso el nombre del campo va a hacer un gion bajo (_).
 * 
 * 
 * - campo: nombre del campo asociado al modelo en el arror de validacion o un _ en 
 * el caso q sea un error de red o del lado del cliente. 
 * 
 * - valor del campo : arreglo de mensajes de error.
 * 
 */
export interface Errorr {
    [campo:string]:string[];
}
