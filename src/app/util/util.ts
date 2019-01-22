export class Util {
    /**
     * Tiempo que se demora el snackbar en pantalla. Es decir que se le muestra al usuario.
     */
    public static readonly SNACKBAR_DURACION_OK = 7000;
    public static readonly SNACKBAR_DURACION_INFORMACION = 7000;
    public static readonly SNACKBAR_DURACION_ERROR = 20000;

    /**
     * Claves de la api de Storage (Local Storage)
     */
    //Clave q se usa para almacenar los datos del usuario autenticado.
    public static readonly STORAGE_DATOS_USUARIO_AUTH = "usuario_autenticado";

    //Guardar las credenciales para proximos inicios de session.
    public static readonly STORAGE_GUARDAR_CREDENCIALES = "guardar_credenciales";

    /**
     * 
     * Comprueba is un objeto esta vacio
     * @param obj
     */
     public static isObjVacio(obj: {[key:string]: any}):boolean {         
        return Object.keys(obj||{}).length ? false: true;
    }
}
