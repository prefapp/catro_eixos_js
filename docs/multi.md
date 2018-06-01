# Tareas paralelas en catro-eixos-js

## FANIN y FANOUT

Todo proceso en catro_eixos_js puede paralelizarse. Para ello, basta con crear un método *FANIN* y un método *FANOUT*

En un ejemplo:

```js

//proceso
class extends Proceso{

    __r(){

        return [

            "__a"

        ]

    }

    FANOUT__a(){

       let ids = this.arg("ids") 

       let i = 0; 

       //paralelizamos 3 
       return this.fan(3, function(){

            return ids[i++];

       })
        

    }

    __a(id){

        //hacer algo con el id

    }

    FANIN__a(resultados){

        //tenemos aquí los resultados

    }




}



```
El método FANIN devuelve un objeto de tipo fan creado a través del método *this.fan*:

```js


   FANIN__foo(){

     return this.fan(

        5, // número de workers a paralelizar

        function(){  //función fan devuelve los argumentos para cada worker o false en fin de trabajo

            /*Devuelve el argumento para el siguiente worker*/

        }

     )


   }



```

El método principal sirve como worker (se paralelizará)

```js

    //recibe como entrada el argumento siguiente pasado por el fan
    __foo(arg){


    }


```

Por último, el método FANOUT recoge todos los resultados de todos los workers durante todas las ejecuciones en forma de Array.

```
    FANOUT__foo(resultados){ //array con todos los resultados de todos los workers en todas sus iteraciones

    }

``` 







