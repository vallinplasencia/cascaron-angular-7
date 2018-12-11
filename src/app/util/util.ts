export class Util {
    /**
     * Tiempo que se demora el snackbar en pantalla. Es decir que se le muestra al usuario.
     */
    public static readonly SNACKBAR_DURACION_OK = 7000;
    public static readonly SNACKBAR_DURACION_INFORMACION = 7000;
    public static readonly SNACKBAR_DURACION_ERROR = 20000;

    /**
     * 
     * Comprueba is un objeto esta vacio
     * @param obj
     */
     public static isObjVacio(obj: {[key:string]: any}):boolean {         
        return Object.keys(obj).length ? false: true;
    }
}
