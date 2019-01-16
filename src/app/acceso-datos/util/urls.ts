export class Urls {
  /**
   * URL donde se van a guardar y obtener los datos de la app.
   * 
   */
  // public static readonly URL_APP = 'https://localhost:44386';
  public static readonly URL_APP = 'http://localhost:50051';
  //  public static readonly URL_APP = window.location.origin;

  /** 
   * URL donde se podran guardar los LOG (errores) de la app.
   * Si se va a utilizar una URL diferente a la de la app hay q crear un 
   * servcio q gestione los LOG y que NO DEPENDA de ApiService. Pues no se 
   * puede cambia la URL de ApiService debido a la Inyecc Dependenc obliga a que
   * haya una unica instancia de ApiService y si cambias la url en este servicio
   * cambiaria para toda la App. 
   */
  public static readonly URL_LOG_APP = Urls.URL_APP;

  /**
   * Url donde se obtiene el token de acceso del usuario autenticado y otros datos del usuario
   */
  public static readonly TOKEN = "Token";
  

  public static readonly ACCOUNT = 'api/account';

  public static readonly CATEGORIAS = 'api/categorias';
  public static readonly RESPONSABLES = 'api/responsables';

  public static readonly ACTIVOS = 'api/activos';
  public static readonly ACTIVOS_CAMPOS = 'api/activos/activo-campos';
  public static readonly ACTIVOS_Y_CAMPOS = 'api/activos/activo-y-campos';



  ///////////////////**************PARAMETROS DE LAS URLs********************///////////////////// 

  public static readonly PARAM_PAGINA = "_pagina";
  public static readonly PARAM_LIMITE = "_limite";

  public static readonly PARAM_ORDENAR_POR = "_ordenar";
  public static readonly PARAM_ORDEN = "_orden";

  public static readonly PARAM_FILTRO = "_filtro";



  ///////////////////**************Cabeceras de las Respuestaas********************///////////////////// 

  /**
   * Total de items en un listar
   */
  public static readonly HEADER_TOTAL_COUNT = "x-total-count";


  /**
   * Total de items en un listar pero este listar va a ser un listar SECUNDARIO
   * es decir se va a utilizar dentro de un formulario para seleccionarce como
   * campo de algun item q se este guardando.
   */
  public static readonly HEADER_TOTAL_COUNT_SEC_RESPONSABLES = "x-total-count-responsables";


  /**
   * Retorna la url absoluta basada en la url BASE de la APP y el path que le 
   * pases por @param urlOrPath .Si le pasas una url absoluta la retorna exactamente. 
   * La url base se define en esta clase.
   * @param url path o url absoluta.
   */
  public static crearUrl(url: string) {
    return url.startsWith('http') ? url : `${this.URL_APP}/${url}`;
  }
}
