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

## Controlador de subprocesos

Para controlar un flujo de ejecución que anida subprocesos (P -> s1 -> s2 -> sn), se puede emplear el *ControladorSubprocesos* que permite establecer niveles de completado, hitos y resultados cuando partes del proceso (ejecutadas en subprocesos) se vean completadas. 

Imaginemos que tenemos un esquema como el que sigue:

```js

---Principal
   |
   |----------> S1
                |
                |----------> S2

```

En esta situación, se puede establecer a nivel del proceso principal un controlador que permita actualizar sus propios resultados (los de su tarea) en función de los pasos que se vayan ejecutando en los procesos auxiliares:

```js


const {Proceso} = require("catro-eixos-js");


module.exports = class extends Proceso{

	__r(){

		return [
			"__llamarAS1",
		]
	}

	__llamarAS1(){

		return this.subProceso(

			"Foo.S1",

			{
				//parámetros de llamada a S1
			},

			{
				controlador_subprocesos: {

					//en llamada a este paso de S1, se actualiza el porcentaje de completado
					//del proceso principal

					"Foo.S1.__paso1": {

						porcentaje: 30
				
					},

					//en el paso2 de S1, se pone un hito en el principal
					"Foo.S1.__paso2": {

						porcentaje: 40,

						hito: "YA_EN_PASO2_DE_S1"

					}


				}
			}

		)

	}



}



```



 





