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

Se puede ver un ejemplo en este [test](test/fixtures/proceso_fs.js)



