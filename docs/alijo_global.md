# Alijos

Los alijos son almacenes de tipo clave-valor. Permiten una persistencia en memoria que puede usarse a nivel:

* *Instancia*: cada proceso tiene un alijo local que está asociada a la instancia del mismo. 

* *Global*: un alijo global es asignado a cada instancia del procesador y compartida por todas las familias y procesos que corren en él.  


## Alijo local

El alijo local se crea y asocia a cada instancia de un proceso. Permite guardar y recuperar valores asociados a claves. 

El método *this.a* permite hacer get/set de los valores del alijo:

```js

const {Proceso} = require("catro-eixos-js");


class MiProceso extends Proceso{

    __pasoA(){

        //almacenamos un valor en el alijo
        this.a("valor", 5)

    }

    //...

    __pasoFoo(){

        //recuperamos el valor del alijo
        const v = this.a("valor");

    }


}


```

El alijo a nivel de instancia *NO* se puede compartir entre procesos. Para poder establecer valores a nivel de todos los procesos, es necesario emplear el *alijo global*.

## Alijo global

Almacén clave-valor común a todos los procesos de un procesador. 

Métodos:

* A(clave): getter del alijo global.
* A(clave, valor): setter del alijo global. 
* VACIAR_ALIJO(): vacia el alijo global.
* UNSET_A(clave): elimina un valor del alijo global.

