# Info

Información en tiempo real de un procesador de catro-eixos-js

## Motivación

Todo procesador puede exponer información acerca de una serie de parámetros de su propio funcionamiento:

* Procesos
  * ejecutados
  * ejecutándose
* Tareas:
  * ejecutadas
  * ejecutándose

...

En ejemplo de salida:

```js

{
    procesos: {

        ejecutandose: 3,
        ejecutados: 210,
        procesosEjecutados: {
            "Foo.proceso_1": 30,
            "Foo.proceso_2": 20
        },
        procesosEnEjecucion: {
            "Foo.proceso_3": 1,
            "Foo.proceso_2": 2
        }
    },

    tareas: {
        ejecutadas: 100,
        ejecutandose: 3
    }
    

}

```


## Gestión

El sistema de información del procesador se tiene que habilitar en las opciones de init 

```js

const {init} = require("catro-eixos-js");

init({

    //familias de procesos


}, {

    //opciones
    limites: {},

    info: {

        bindings: {

            //la llamada a esta función daría acceso
            callback: (info) => { console.log(info)},

            //se puede acceder a la información desde este socket
            unix: "/tmp/procesador.s"
        }

    }

})

```

## Middleware

Se permite crear middleware que sobrecargue o introduzca nueva información en el sistema de info
