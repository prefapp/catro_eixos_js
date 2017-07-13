"use strict";

module.exports = {

    init: require("./lib/nucleo/init.js"),

    Proceso : require("./lib/nucleo/proceso.js"),  

    Ejecutor: require("./lib/nucleo/ejecutor.js"),

    Tarea: require("./lib/nucleo/tarea.js"),

    Procesador: require("./lib/nucleo/procesador.js"),

    FamiliaProcesos: require("./lib/nucleo/familia_procesos.js"),

    mixin: require("./lib/utiles/mixin.js"),

    ProcesoBootstrap: require("./lib/bootstrap.js")
}
