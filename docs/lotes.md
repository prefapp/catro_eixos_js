# Ejecución de pasos por lotes

## Motivación

En caso de querer realizar una ejecución de varios pasos de forma ordenada dentro de un método, se puede emplear *__runLote*

## Empleo

```javascript

class MiProceso extends Proceso{

    __r(){
      return ["__a"]
    }

    __a(){
        
        //se ejecutan secuencialmente y por orden
        //los métodos con los args
        return this.__runLote([

            ["A", 1],
            ["B", "cadena"],
            ["C", {}]

        ]);
    }

    //recibimos los resultados por el orden que se pasaron
    OK__a(resultados){

        resultados[0] // A
        resultados[1] // B
        resultados[2] // C

    }




}

```
