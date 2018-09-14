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

			"__esperarD",

			"__d",

			"__esperarE",

			"__e",

			"__f"

		]


	}

	__esperarD(){

		return (async () => {

			let ok = false;

			while(!ok){

				let r = this.arg("callback_control")();

				console.log(r)

				if(r == "D"){
					 ok = true;
				}
				else{
					await this.__esperar(0.15);
				}	
				

			}


		})();

	}

	__d(){


	}

	__esperarE(){

		return (async () => {

			let ok = false;

			while(!ok){

				let r = this.arg("callback_control")();

				if(r == "E"){
					 ok = true;
				}
				else{
					await this.__esperar(0.15);
				}	
				

			}


		})();

	}

	__e(){


	}

	__f(){

		return this.__esperar(2);
	}

}
