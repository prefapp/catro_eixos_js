# Helpers

## __esperar

Este método permite dormir una serie de segundos antes de continuar la ejecución. 

```js

const {Proceso} = require('catro-eixos-js');

class MiProceso extends Proceso{


    __dormir(){

        //dormimos el proceso durante 5 segundos
        return this.__esperar(5)
    }

    __foo(){
        //continúa la ejecución normalmente
    }

}


```
