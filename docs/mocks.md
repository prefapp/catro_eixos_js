# Procesos mock

Un proceso mock es uno que sustituye a un proceso real para devolver datos "prefabricados". 

Se conciben como un apoyo al desarrollo. 

Los procesos mock tienen la siguiente firma:

```bash
 <nombre_proceso>.mock.js

```

CatroEixos carga el proceso mock y sustituye la ejecución del proceso real por el proceso mock. 

## Contenido del proceso mock

Un proceso mock es un módulo que exporta una función que llamará CatroEixos y que devolverá un resultado.  

La función debe tener la siguiente firma:

```js

module.exports = function(args, refProceso){

    //procesamiento

    //devuelve resultado (puede ser una Promise)

    //el resultado final tiene que ser un objeto
    //se convertirá en resultados por cada key-valor

}

```

## Carga de procesos mock

El sistema permite la carga de procesos mock de tres formas distintas:

* Pasándole un argumento a la función init:

```js

const {init} = require("catro-eixos-js")

init({

    //familias de procesos

}, {


    MOCKS: true,  //el sistema cargará TODOS los mocks disponibles

})


```

* En la llamada subProceso, forkProceso o mProceso

```js

const {Proceso} = require("catro-eixos-js");

class MiProceso extends Proceso{

    __r(){

        return [

            "__sub",

            "__modulo",

            "__fork"

        ]

    }

    __sub(){


        return this.subProceso(

            "Foo.proceso",

            {   
                __MOCK__: true,
            }

        )

    }

    __modulo(){

        return this.mProceso(

            "modulo#Familia.proceso",

            {       
                __MOCK__: true
            }

        )

    }

    __fork(){

        return this.__forkProceso(

            "Foo.proceso_fork",

            {
                __MOCK__: true
            }

        )

    }

}

```

* Mediante la declaración MOCK en el proceso principal

```js

const {Proceso} = require("catro-eixos-js");

class extends Proceso{

    MOCK(){

        /*
         * Todos los procesos y subprocesos iniciados 
         * por este proceso emplearán mocks
         */
        return true;
    
    }

    __r(){
    
        return [

            "__a"
        ]

    }


}


```



