# De los bloqueadores

Un lock o bloqueador es una forma de controlar el acceso exclusivo a un recurso global de tal manera que se eviten casos de concurrencia. 

## Locks en catro-eixos

Todo *proceso* en catro-eixos-js puede bloquear el acceso a otro proceso a un determinado recurso. 


```js

const {Proceso} = require("catro-eixos-js");


class MiProceso extends Proceso{


	__r(){

		return [

			"__bloquearRecurso",

			//... procesado

			"__desbloquearRecurso"

		]

	}

	__bloquearRecurso(){

		return this.BLOQUEAR(

			"RECURSO",

			{

				timeout: 10 //en segundos

			}

		)


	}

	__desbloquearRecurso(){

		return this.DESBLOQUEAR(){

			"RECURSO"

		}

	}


}




```
