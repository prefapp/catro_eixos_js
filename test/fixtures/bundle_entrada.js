const init = require("./init.js");

const {Tarea} = require("../../index.js");

init().then((refProcesador) => {

    return refProcesador.ejecutar(

        new Tarea("foo", {

            proceso: "B.test"
    
        })
    )

}).then(() => {

    process.exit(0);

})
