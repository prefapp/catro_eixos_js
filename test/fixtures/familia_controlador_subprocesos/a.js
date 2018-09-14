const {Tarea, Proceso} = require("../../../index.js");

module.exports = class extends Proceso{

	DEPURAR(){
	//	return true;
	}	

	parametrosNecesarios(){

		return {

			"callback_control": Function,

		}

	}

	__r(){

		return [

			"__esperarA",

			"__a",

			"__esperarB",

			"__b",

			"__c"

		]


	}

	__esperarA(){

		return (async () => {

			let ok = false;

			while(!ok){

				let r = this.arg("callback_control")();

				console.log(r)

				if(r == "A"){
					 ok = true;
				}
				else{
					await this.__esperar(0.15);
				}	
				

			}


		})();

	}

	__a(){


	}

	__esperarB(){

		return (async () => {

			let ok = false;

			while(!ok){

				let r = this.arg("callback_control")();

				if(r == "B"){
					 ok = true;
				}
				else{
					await this.__esperar(0.15);
				}	
				

			}

			this.a("estoy_en", "B");

		})();


	}

	__b(){

	}

	__c(){

		return this.subProceso(

			"Familia.b",

			{
				callback_control: this.arg("callback_control")
			}

		)
	}

}
