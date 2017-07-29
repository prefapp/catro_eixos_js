# CatroEixosJs

Librería de gestión de procesos (trabajos) en JS. 

## Uso básico

```js

// ejemplo.js

const CE = require("catro-eixos-js");

class TrabajoEjemplo extends CE.Proceso {

    __r() {

        return [

            "__a",
            "__b", 
            "__c"

        ]
        
    }

    __a(){
        //esto se ejecutará primero
    }

    __b(){
        //esto después
    }

    __c(){
        //esto al final
    }

}

```
## Control de flujo

Todo método del proceso puede definir, adicionalmente, pasos previos, de control y de Log

```js

const CE = require("catro-eixos-js");

class TrabajoEjemplo extends CE.Proceso {

    __r() {

        return [

            "__a",

        ]
        
    }

    PRE__a(){
        //ejecución previa 
    }

    __a(){
        //código principal
    }

    OK__a(){
        //esto se ejecutará posteriormente si no hay errores
    }

    KO__a(err){
    
        //esto se ejecutará en caso de un error en __a
    }

}

```

## Sincronía y asincronía

CatroEixosJs emplea [Promises](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Promise) para trabajar con elementos asíncronos, garantizando, no obstante, que el flujo interno del proceso siempre es síncrono. 

```js

const CE = require("catro-eixos-js");

class TrabajoEjemplo extends CE.Proceso {

    __r() {

        return [

            "__uno",
            "__dos"

        ]
        
    }

    __uno(){

        return new Promise((cumplida, falla) => {

            //realizar un trabajo asíncrono
            ...
        
            //en caso de error
            falla(err);

            //en caso de ejecución correcta
            cumplida();

        })
    }

    __dos(){

        //este código no se ejecutará en ningún caso hasta que __uno haya terminado

    }

}

```

## Paso de parámetros y volcado de resultados

Para trabajar con procesos, CatroEixosJs, crea el primitivo *Tarea*

Una Tarea siempre cuenta con:

- Id: (String) identificador de la tarea
- Args: (Objeto) argumentos de la tarea
- Resultados: (Objeto) resultados de la ejecución de la tarea

```js

const CE = require("catro-eixos-js");

let tarea = new CE.Tarea("foo", {

    "arg1": 23,

    "arg2": 24

});

let proceso = new Proceso(tarea);

proceso.ejecutar()

    .then((tarea) => {

        //el resultado del proceso es correcto

    })

    .catch((tarea) => {

        //el resultado de la tarea es erróneo

    })

```

## Familias de procesos

Los procesos se almacenan en una *Familia*, las familias son colecciones de procesos identificables por una cadena de texto:

- "FAMILIA.PROCESO"

Basta con crear los ficheros de proceso (foo.js) en un mismo directorio:

```bash

--- archivos
--- archivos/crear.js
--- archivos/borrar.js
--- archivos/leer.js

```

Crear una familia de procesos con esta estructura es muy sencillo:

```js

const CE = require("catro-eixos-js");

class FamiliaArchivos extends CE.Familia{

    constructor(){
        super("Archivos", __dirname + "/archivos");
    }
}

//si la cargamos

new FamiliaArchivos.cargar()

    .then((familia) => {

        console.log(familia);

    })

/*
    output:

    {
        "Archivos.crear" : [Function: ArchivoCrear],
        "Archivos.borrar": [Function: AchivoBorrar],
        "Archivos.leer" : [Function: ArchivoLeer]

    }

*/

```

## Documentación

* [ProcesoBootstrap](docs/bootstrap.md): para realizar arranques de un sistema. 
* [TestUnidadProceso](docs/unidad_proceso.md): para depurar/desarrollar procesos.
* [REPL](docs/repl.md): CLI para catro-eixos-js

Copyright (C) 2017, Francisco Maseda

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
