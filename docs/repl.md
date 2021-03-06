# REPL de CatroEixos

## Funcionalidades

Además de las propias del REPL de NodeJS, se agregan, por defecto una serie de funcionalidades base:

* *.l*: listar los procesos disponibles en un procesador

* *.c*: cargar un fichero de datos en una variable

* *.r*: ejecutar un proceso en el procesador

* *.u*: recarga el procesador (los módulos js)

## Utilización


### Uso básico

Se crea un fichero de javascript:

```js
const {init, repl} = require('catro-eixos-js');

repl(
  function(){
    return init({
      //familias de procesos
    });
  },

  {
    precargar: {

      db: () => {require("./models")}

    }
  } //opciones adicionales
)


```

Se puede ejecutar desde la línea de comandos

```bash
node mi_repl.js

>

```

### Ejecución de un proceso

Además de sentencias arbitrarias, se pueden ejecutar procesos:

```bash

>.r MiProceso a=1 b=2

```
El sistema tiene autocompletado *tab* de:

* procesos
* argumentos

### Acceso al contexto

El REPL puede desreferenciar variables en el contexto global:

```
> foo = "./data/mi_fichero.json"
./data/mi_fichero.json

>.r Cargar.fichero ruta=foo

{
  proceso: "Cargar.fichero",
  ruta: "./data/mi_fichero.json"
}

```









