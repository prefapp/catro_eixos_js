# Eventos de un proceso

Listado de algunos eventos que se disparan durante la ejecución de un proceso. 

- INICIO_PROCESADO
- FIN_PROCESADO
- PORCENTAJE_ACTUALIZADO

## Asociar manejadores para eventos

Desde fuera:

```js

refProcesador
    
    .ejecutar(

        new Tarea(

            "id-tarea", 

            {
                proceso: "Familia.proceso",
            }
        ),

        {
            eventos: {
                "INICIO_PROCESADO": () => {
                    // tu código
                },
            }
        }           

    )
```

Controla un proceso desde otro proceso

```js

class MiProceso extends Proceso{


    __r(){
        return [
            "__llamarASubproceso"
        ]
    }

    __llamarASubproceso(){

        return this.subProceso(

            "A.subproceso",

            {
                //argumentos
            },

            {
                eventos: {

                    PORCENTAJE_ACTUALIZADO: (porcentaje) => {

                        //actualizo mi propio porcentaje (este subproceso es un 20% de mi propia tarea)
                        this.porcentaje(porcentaje * 0.20);
                    }

                }
            }
        )
    }
}

```



