### ProcesoBoostrap

Un proceso boostrap se define de forma dinámica

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

