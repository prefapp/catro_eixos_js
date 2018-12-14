const ProcesoBase = require("./base.js");

module.exports = class extends ProcesoBase{

	DEPURAR(){
		//return true;
	}

	__r(){

		return [

			"__bootA",
			"__bootB",
			"__confirmarBoot"

		]

	}

	__bootA(){


	}

	__bootB(){

	}

	__confirmarBoot(){

		if(this.arg("confirmacion")){
			this.arg("confirmacion")("BOOT_REALIZADO");
		}
	}
}
