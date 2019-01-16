# ExamenFE
Este proyecto es un proyecto de partida para crear un proyecto mas compleje. Este proyecto ya tiene creado una estructura de directorios basica como la capa de acceso a datos(Model),  que permite  recibir datos a traves de desde una Api RestFull.

## Detalles de la estructura del proyecto. IMPORTANTE.
<pre style="font-size: 16px;">app
 ┬
  ├[DIR]acceso-datos  ==> Directorio maneja todo lo referente a HTTPClient.

   ├[DIR]error ==> Contiene toda la logica del manejo de errores.
    
    ├[DIR]models ==> Contiene interface para manejar datos de los RECURSOS CONCRETOS(Los q se guarda en la BD) provenientes del servidor. Ver tambien el Directorio APP/ACCESO-DATOS/UTIL/ENTIDADES. 

    ├[DIR]repos ==> Contiene los servicios q se utilizan para hacer las peticiones(HttpClient) al Backend.

    ├[DIR]seguridad ==> Igual q el directorio repo pero servicios de seguridad.
    
    ├[DIR]util ==> Contiene directorios y carpetas que estan relacionado con el acceso a los datos.
     
     ├[DIR]entidades ==> Contiene interfaces q se utilizan para manejar datos GENERALES provenientes del servidor. Ver tambien el Directorio APP/ACCESO-DATOS/MODELS.

      ├activo-campos ==> Interfaz q se utiliza al crear o editar un activo. Contiene datos q se carga del servidor para poder asignarselos al valor de algun campo del ACTIVO. Esto generalmente se utilizan en campos << SELECT >>.

      ├errorr ==> Interfaz q representa los error provenientes del servidor y/o errores internos de la app.

      ├item-data ==> Interfaz q representa el manejo de datos INTERNOS DE LA APP. La app convierte los datos provenientes de el Backend a esta interfaz. Es como una CAPA intermedia entre Backend y el Frontend. IMPORTANTE ESTA INTERFAZ.

      ├usuario-auth ==> Contiene todos los datos del usuario autenticado.

    ├codigo-app ==> Codigos manejados internamente por la app.
    
    ├url ==> Contiene todas la url de la app.
 
 ├[DIR]activos ==> Modulo que representa el trabajo con un activo. El directorio activos/activo contiene componentes los cuales son un EJEMPLO (CRUD) del trabajo con Modelo de datos(tablas en bd) q depende de otros modelos de datos(otras tabla en la bd). Relacion en la bd 1-m.

 ├[DIR]comprobar ==> componente q uso para verificar algo. uso personal mio.
 
 ├[DIR]configuracion ==> Modulo que representa el trabajo con categoria y responsable. 
  
  ├[DIR]categoria ==> Contiene componentes los cuales son un EJEMPlO (CRUD) del trabajo con Modelo de datos(tabla en bd) q NOOO tiene relacion con otras tablas de la bd.
  
  ├[DIR]resposable ==> Contiene un unico componente q es un dialog para utilizarlo al seleccionar el RESPONSABLE en un ACTIVO al darle de alta.
 
 ├[DIR]seguridad ==> Modulo qontiene varios componentes utilizados para el proceso de
 registrar, cambiar-clave, login y logout en la app.
 
 ├[DIR]template ==> Modulo q contiene varios componentes utilizados en la app.
  
  ├[DIR]error-modelo ==> Componente q muestra errores de validacion cuando estos tipos de errores NO son procesados en el fronend. Estos errores son RAROS pero pueden ocurrir.
  
  ├[DIR]home ==> Componete inicial de la app mostrado en el area de contenido del template.
  
  ├[DIR]page-not-found ==> Componente q se muestra cuando no se encuentra una ruta.
  
  ├[DIR]platilla ==> Componente q contiene la estructura del template(barra superior, inferior y conteno).
  
  ├[DIR]sidebar ==> Directorio q contiene varios componentes q son los q se muestran en la barra lateral segun el menu seleccionado en la barra superior.
  
  ├[DIR]snackbar ==> Directorio q tiene dos componentes q se van a visualizar dentro de un SNACKBAR. Snackbar de Error y el otro de q todo fue OK.

  ├[DIR]util ==> Directorio q contiene varios directorios y archivos de utilidad.
   
   ├[DIR]guards ==> Contiene los GUARDS q seran aplicados a las rutas.
    
    ├can-deactivate ==> Guard GENERAL q verifica si una ruta se puede abandonar. Se usa generalmente cuando se cambian los datos al dar de alta a un item q NO se pueda abandonar esa ruta y te pregunta si NO quieres guardar los datos primero.
    
    ├role-autorizar ==> Verifica si el usuario logueado tiene el role pasado por datos para q pueda visitar una ruta.
    
    ├usuario-autenticado ==> Comprueba solo si el usuario esta autenticado. NO verifica ningun role.
    
    ├usuario-no-autenticado ==> Comprueba solo q el usuario NO esta autenticado aun.

   ├[DIR]http-interceptors ==> Interceptores de HTTPClient.
    
    ├auth-interceptor ==> Agrega el token de usuario autenticado en cada peticion q se realice al Backend.
    
    ├[DIR]services ==> Directorio q contiene servicios q se utilizan dentro de la app. Pero NO de peticiones con HttpClient es dicir servicios internos.
   
   ├tipos-roles ==> Clase q contiene constantes con los tipos de roles de los usuarios.
   
   ├util ==> Clase q contiene generalmente constantes con datos q usa la app. Como el tiempo q muestra en pantalla los snackbar, Se puede poner aqui cualquier dato de uso de la app q NO encage en mas ningun lado.
   
   ├[DIR]valores ==> Clase q contiene valores relacionados generalmente con componentes de la app.
  
  ├app-material-module ==> Modulo q carga y exporta los componentes de Angular Material Design.
  
  ├app-routin-modulo ==> Modulo de rutas.
  
  ├app.component ==> Componente inicial de la app.
  ├app.module ==> Modulo principal de la app.
</pre>

## Tecnologia
* [Angular 7](https://angular.io/)
* [Angular Material Design](https://material.angular.io/)
* [Bootstrap 4](https://getbootstrap.com/)



## Instalacion

### Clonado el repo
``` bash
# clonando el repositorio
$ git clone https://github.com/vallinplasencia/cascaron-angular-7 cascaron-angular-7

# Navedando al directorio del proyecto
$ cd cascaron-angular-7

# Instalando las dependencias del proyecto
$ npm install
```

### Forma para correr y generar (run and build) el proyecto.

``` bash
# Correr el servidor en desarrollo, se recargan automaticos los cambios, localhost:4200.
$ ng serve --open 

# Construir el proyecto para produccion
$ ng build --prod
```
## LICENSE

Esta aplicacion está bajo licencia [MIT license](https://opensource.org/licenses/MIT).


## ***************** MAS DATOS INTERESANTES *****************

##Examen-FE

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
