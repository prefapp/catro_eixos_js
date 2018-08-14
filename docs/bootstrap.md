### ProcesoBoostrap

Un proceso boostrap se define de forma dinámica y permite una ejecución ordenada de pasos de tipo boot. 

Los pasos de tipo boot se definen mediante el método *this.boot*, que acepta dos parámetros:

- Cadena con el mensaje del paso boot
- Código a ejecutar

```js

//definir un proceso boostrap
const {ProcesoBoostrap} = require("catro-eixos-js");

const MiBoostrap = ProcesoBoostrap(function(){

    this.boot("Carga 1", function(){

        //codigo de carga
        // throw MiError si es necesario
        // tengo acceso a todo this.arg, this.resultado...
        // puedo devolver promesas
        // puedo llamar a subprocesos...

    })

    this.boot("Carga 2", function(){

        //codigo de carga
        //throw MiError si es necesario
    })

})

//OBtenemos un proceso que ejecutará todos los pasos de forma ordenada
new MiBoostrap(tarea).ejecutar()

    .then(({resultados}) => {

            //boostrap correcto
    })
    
    .catch((err) => {

            //boostrap falló en algún punto

    })
```

Los procesos boostrap, permiten la ejecución de una serie de tareas previas al propio arranque de la aplicación. 





