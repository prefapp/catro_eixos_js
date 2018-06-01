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

## porcentaje

Establece un % de completado de la tarea en curso. 

Apunta un resultado en tarea (porcentaje_completado).

Lanza un evento de *PORCENTAJE_ACTUALIZADO*


## UtilesFS

Conjunto pequeño de elementos básicos para hacer entrada / salida en disco. 

Todos devuelven una Promise. 

- escribirFichero(ruta, contenido, opciones)
- leerFichero(ruta, opciones)
- existeFichero(ruta)
- borrarFichero(ruta)

### Uso

Se puede ver un ejemplo en este [test](../test/fixtures/proceso_fs.js)

## Secuenciación de pasos (método paraCada)

Permite enviar una serie de tareas asíncronas (promesas) de forma ordenada y con una espera opcional de tiempo (en segundos).

```js

//proceso

  __foo(){

    const tareas = lista.map((n) => {

        return () => {

            return this.subProceso(
    
                "MisProcesos.foo2",

                {
                    numero: n
                }
    
            )

        }

    })

    return this.paraCada(tareas, 0.75); //ejecuta las tareas de forma escalonada con una espera de 0.75 segundos


  }


```

El helper *paraCada* acepta un array de funciones que devuelven una Promise y, opcionalmente, un tiempo en segundos de espera entre procesado y procesado. 








