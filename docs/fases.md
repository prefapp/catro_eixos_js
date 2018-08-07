# Fases de paso en un proceso


## Paso en bucle

En el caso de querer crear un bucle (repetición de la ejecución de un paso un número arbitrario de veces) se puede emplear la fase REP:

La fase REP de un paso devuelve un valor único (true o false) que determinará si el paso debe seguirse ejecutando. 

Si devuelve true, se termina el bucle, en caso contrario, se sigue ejecutando. 


En un ejemplo:

```js

const {Proceso} = require("catro-eixos-js");

class MiProceso extends Proceso{


    //recibe dos argumento:
    // ok => (primer argumento): el resultado de la última ejecución del paso (null la primera vez)
    // i  => (segundo argumento): el número de iteraciones que se llevan realizadas    

    REP__foo(ok, i){

        //se consulta en cada vuelta del bucle para determinar
        //si se tiene que seguir ejecutando el paso __foo
 
        return ok == "SALIR"       

    }
    
    __foo(){

        //hacer algo

        //si devuelve un valor se le pasa a REP__foo
    }



}


```



