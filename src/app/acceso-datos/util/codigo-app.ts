export class CodigoApp {
    /**
     * Codigo retornado cuando se realiza una peticion mediante http y todo fue Bien.
     * 
     * Ejemplo: Se solicitan datos y estos se obtienen correctamente
     */
    public static readonly OK = 200;

    /**
     * Codigo retornado cuando se realiza una peticion mediante http y todo fue bien pero
     * no se retornan datos. Generalmente en un UPDATE.
     * 
     * Ejemplo: Se actualizan datos en una entidad en el servidor.
     */
    public static readonly OK_NO_CONTENIDO = 204;

    /**
     * Codigo cuando se solicita un recurso y el usuario no tiene 
     * los permisos(roles) necesarios.
     */
    public static readonly ERROR_UNAUTHORIZED = 401;

    /**
     * Codigo cuando falla la autenticacion del usuario.
     * Es decir si el usuario y clave del usuario son incorrecto. 
     */
    public static readonly ERROR_AUTENTICACION_FALLA = 4401;

    /**
     * Codigo cuando los datos enviados no son validos asociado generalmete con los datos 
     * enviados.
     * 
     * Generalmete se retorna en peticiones de salvar datos aunque existen excepciones.
     */
    public static readonly ERROR_VALIDACION = 400;

    /**
     * Codigo cuando se realiza una peticion incorrecta (Codigo de retorno HTTP 400).
     * Pero la respuesta a esta peticion no tiene mensaje de validacion de datos. es decir 
     * el motivo es otro q no es validacion de datos.
     * 
     * Generalmete se retorna en peticiones de salvar datos.
     */
    public static readonly ERROR_PETICION_INCORRECTA_GENERAL = 1400;

    /**
     * Codigo retornado cuando los datos enviados no son validos O a ocurrido un error
     * general pero asociado generalmete con los datos enviados.
     * 
     * Generalmete se retorna en peticiones de salvar datos.
     */
    public static readonly ERROR_NO_ENCONTRADO = 404;

    /**
     * Codigo retornado cuando ocurrio un error inesperado.
     */
    public static readonly ERROR_INESPERADO = 500;


    /**
     * Se ha producido un codigo de error q la aplicacion no maneja.
     */
    public static readonly ERROR_GENERAL = 1500;

    /**
     * Sin conexion
     */
    public static readonly ERROR_SIN_CONEXION = 1555;
}
