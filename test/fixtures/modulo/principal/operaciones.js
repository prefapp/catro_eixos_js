const Base = require("../procesos/base.js");

module.exports = class extends Base{

	parametrosNecesarios(){
	
		return {

			a: Number,
			b: Number

		}

	}

	__r(){

		return [

			"__sumarCifras"

		]

	}

	__sumarCifras(){

		return this.mProceso(

			"MODULO#A.sumar",

			{
				a: this.arg("a"),
	
				b: this.arg("b")
			}

		).then(({suma}) => {

			this.resultado("suma", suma);
		})

	}

}
