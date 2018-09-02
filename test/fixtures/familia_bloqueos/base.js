const {Proceso} = require("../../../index.js");

module.exports = class extends Proceso{

	parametrosNecesarios(){

		return ["identificador"]

	}

	__r(){

		return [
			"__bloquearTESTIGO",
			"__modificarTESTIGO",
			"__desbloquearTESTIGO"
		]

	}

	__bloquearTESTIGO(){

		return this.BLOQUEAR("TESTIGO", {yo: this.arg("identificador")});

	}

	__modificarTESTIGO(){

		console.log(this.arg("identificador"))
		
		this.A("testigo", this.arg("identificador"))

		return this.__esperar(0.5);
	}

	EVAL__modificarTESTIGO(){

		const s = this.A("testigo") === this.arg("identificador")

		if(!s){
			throw `TESTIGO MODIFICADO FUERA DEL BLOQUEO en ${this.arg("identificador")}

				vale: ${this.A("TESTIGO")}
			`
		}

	}

	__desbloquearTESTIGO(){

		return this.DESBLOQUEAR("TESTIGO");

	}
	


}
