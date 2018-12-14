const ProcesoBase = require("./base.js");

module.exports = class extends ProcesoBase{

	parametrosNecesarios(){
	
		return {

			a: Number,
			b: Number

		}

	}

	__r(){

		return [
	
			"__sumar"

		]

	}

	__sumar(){

		this.resultado("suma", this.arg("a") + this.arg("b"));

	}
}
