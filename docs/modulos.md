# De los módulos en CatroEixosJs

Un módulo es un procesador que tiene asociadas una o varias familias de procesos. 

La característica fundamental de un módulo es que se puede *instalar* en un proyecto de catro-eixos-js para ser empleado como si de un plugin o librería se tratase. 

## Del ciclo de vida de un módulo

Los módulos de catro-eixos-js se desarrollan como proyectos de tipo npm que se pueden instalar con el gestor de paquetes de nuestra elección. 

Dichos módulos, una vez instalados, se pueden emplear directamente mediante su inclusión en nuestro proyecto. 


### De la invocación de un proceso de un módulo

Para la invocación de un proceso de un módulo, se recurre al método: *mProceso()*

Dicho método acepta un identificador de *proceso de módulo* y un objeto de argumentos. 

#### Del identificador de proceso de módulo

Se trata de una cadena dividida en tres partes:

```js

class extends Proceso{


	__llamarAProcesoDeModulo(){


		return this.mProceso(

			"primero#Familia.proceso",

			{
				arg1: "",

				//....
			}

		)

	}


}

```

En el ejemplo, estamos llamando al proceso __Familia.proceso__ del módulo __primero__. 


#### Del montaje de un módulo

Los módulos tienen que *instalarse* en el programa principal.
 
Para ello, es necesario:

* Realizar el require del módulo (su npm)
* Ejecutar la función inicial (normalmente devuelve una Promise)
* Pasar el resultado al init principal

En un ejemplo:

```js

const ModuloA = require("modulo_a");
const ModuloB = require("modulo_b");

const {init} = require("catro-eixos-js");

module.exports = function(){

	const modulos_cargados = {};

	return ModuloA().then((ma) => {

		modulos_cargados["A"] = ma;

	}).then(() => {

		return ModuloB().then((mb) => {

			modulos_cargados["B"] = mb;

		})

	}).then(() => {

		return init({

			//procesos del elemento principal

		}, {

			modulos: modulos_cargados

		})

	})


}



```

### De la programación de un módulo

Los módulos se implementan como paquetes normales de node.

1. Creamos nuestro proyecto
2. Instalamos dependencias, en nuestro caso: catro-eixos-js
3. Creamos nuestra estructura:
  * fichero init.js
  * familias de procesos
  * entidades separadas...
4. En el fichero de index.js de nuestro proceso (o en otro a nuestra elección) introducimos 
una función de nuestro proyecto *como un módulo de catro-eixos-js*


Para crear un módulo, en nuestro fichero *index.js* ()

