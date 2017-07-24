# Logs en catro-eixos-js

El sistema de logs está basado en [winston](https://www.npmjs.com/package/winston) 

## Tipos de logs

Se pueden loguear dos tipos de eventos:

* Automáticos:
  * Inicio/Fin de proceso principal
  * Inicio/Fin de subproceso
  * Errores
 
* Custom: configurables mediante segmentos de paso (método LOG)


### Eventos automáticos

La política de logs automáticos se establece al inicio de catro-eixos-js. 

```js

const {init} = require("catro-eixos-js");

    init(familiaProcesos, {


        logs: {

            enDebug: true, //mensajes a nivel de debug se loguean

            loguear: [

                "INICIO_PROCESO_PPAL",
                "FIN_PROCESO_PPAL",
                
                "INICIO_SUBPROCESO",
                "FIN_SUBPROCESO",

                "ERRORES",
                
                "TODO" // colocando esto se loguearía todo

            ],

            enInicio(winston) => {

                //aquí se podría configurar el objeto de winston

                //incluyendo la posibilidad de agregar middleware
                /*
                    winston.add(winston.transports.Logstash, {
                        port: 28777,
                        node_name: 'my node name',
                        host: '127.0.0.1'
                    });
                */
            }

        } 

    })

```


### Log configurable

A nivel de cada proceso, se pueden establecer lugares de log mediante el empleo de etapas *LOG*

```js

class MiProceso extends Proceso{

    //...
    __a(){
    
    }

    LOG__a(){
        return `Este mensaje se va a loguear`
    }
}

```
Por defecto, catro-eixos-js ejecuta las etapas LOG y, si lo que se devuelve es un string, lo envía
al sistema de logs. 

```bash

            # Niveles de log (RFC5424)
            #https://tools.ietf.org/html/rfc5424
    

              0       Emergency: system is unusable
              1       Alert: action must be taken immediately
              2       Critical: critical conditions
              3       Error: error conditions
              4       Warning: warning conditions
              5       Notice: normal but significant condition
              6       Informational: informational messages
              7       Debug: debug-level messages

```


Para determinar el nivel de gravedad del log, se puede incluir, opcionalmente, un indicador de tipo @nivel:

```js

class MiProceso extends Proceso{

    //....
    __a(){

    }

    LOG__a(){
        return `@alert Este mensaje es de alerta`
    }

    __b(){

    }

    LOG__b(){
        return `@error este mensaje es de error`
    }
}

```

Se puede también llamar a directamente al método *__log*:

```js

class MiProceso extends Proceso{

    //....

    __foo(){
        this.__log("Mensaje");
    }


}

```









