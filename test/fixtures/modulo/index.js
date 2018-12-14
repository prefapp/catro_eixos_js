const {init, Modulo} = require("../../../index.js");

module.exports = new Modulo(

	mi_init, 

	{
		boot: "A.boot"
	}


).cargar()

function mi_init(){

	return init({

		"A": __dirname + "/procesos"

	})

}


