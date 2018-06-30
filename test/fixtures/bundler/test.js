const {Proceso} = require("../../../index.js");


module.exports = class extends Proceso{

    __r(){

        return [

            "__crearFichero"

        ]

    }

    __crearFichero(){


        return this.UtilesFS.escribirFichero(

            "/tmp/test_bundle",

            JSON.stringify({test: 1, bundle: 1})

        )

    }


}
