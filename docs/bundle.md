# Empaquetado de aplicaciones catro-eixos-js

Debido al sistema de carga procesos que realiza catro-eixos-js, no es posible empaquetar la aplicación con todos sus procesos sin realizar una tarea de bundling previa. 

## El bundler de catro-eixos-js

El bundler de catro-eixos-js permite analizar las familias de procesos a empaquetar con caracter previo a la tarea de webpack. 

```bash

catro-eixos-bundler [ruta_archivo_init] [ruta_salida]

```

El bundler de catro-eixos-js analiza todos los procesos y sus familias y crea un fichero .js con todas esas dependencias (por defecto *./catro_eixos_bundle.js*)

## Precarga de procesos

Basta con pasar una opción al init para evitar que el sistema intente cargar los procesos bajo demanda, esto es: buscándolos en el sistema de ficheros. 


```js

const {init} = require("catro-eixos-js");


module.exports = function(){

  return init({

    //familias de procesos a cargar

  }, {

    //ruta a nuestro bundle
    EN_BUNDLE: require("./catro_eixos_bundle.js")

  })


}



```
