# Test de Proceso

Permite controlar la ejecución de un proceso con fines de desarollo y depuración

## Uso básico

```js
const MiProceso = require("mi_proceso");
const {TestUnidadProceso} = require("catro-eixos-js");

new TestUnidadProceso(MiProceso)

    .ejecutar({ 
        //lista de argumentos
    })

    .evaluar({

        estado: "OK",
        valor1 : "EL VALOR QUE TIENE QUE TENER"


    }, function(err){

        //callback de finalización

    })

```

* *ejecutar*: recibe los argumentos que vamos a emplear
* *evaluar*: recibe dos argumentos, un objeto con los valores de resultado adecuados 
             y un callback de finalización


## Silencios

Se pueden silenciar los pasos de uno o varios procesos:

```js
const MiProceso = require("mi_proceso");
const {TestUnidadProceso} = require("catro-eixos-js");

new TestUnidadProceso(MiProceso)

    .ejecutar({ 
        //lista de argumentos
    })

    silenciar(["self._paso1", "self._paso2"])

    .evaluar({

        estado: "OK",
        valor1 : "EL VALOR QUE TIENE QUE TENER"


    }, function(err){

        //callback de finalización

    })

```

Los silencios son funciones que sobreescriben los métodos del proceso
sustituyéndolos por una función que solo devuelve aquello que recibe como
argumento (no rompe la cadena de ejecución del proceso)

## Stoppers

Permiten detener la ejecución del proceso en un determinado punto. 

Aparece un mensaje por pantalla y espera a que se pulse una tecla. 

```js

const MiProceso = require("mi_proceso");
const {TestUnidadProceso} = require("catro-eixos-js");

new TestUnidadProceso(MiProceso)

    .ejecutar({ 
        //lista de argumentos
    })

    detenerEn(["self.__paso1"])

    .evaluar({

        estado: "OK",
        valor1 : "EL VALOR QUE TIENE QUE TENER"


    }, function(err){

        //callback de finalización

```
Una vez que el paso uno se ha ejecutado, vemos el siguiente
mensaje por pantalla:

```bash

Método __paso1 ejecutado 
Pulsa tecla para continuar....

```



