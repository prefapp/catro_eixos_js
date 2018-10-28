"use strict";

module.exports = {

    init: require("./lib/nucleo/init.js"),

    Proceso : require("./lib/nucleo/proceso.js"),  

    Ejecutor: require("./lib/nucleo/ejecutor.js"),

    Tarea: require("./lib/nucleo/tarea.js"),

    Procesador: require("./lib/nucleo/procesador.js"),

    FamiliaProcesos: require("./lib/nucleo/familia_procesos.js"),

    mixin: require("./lib/utiles/mixin.js"),

    ProcesoBootstrap: require("./lib/bootstrap.js"),

    TestUnidadProceso: require("./lib/dev/unidad_proceso.js"),

    //logs
    MixinProcesoConBox : require("./lib/log/proceso_con_box.js"), 
    DriverBoxLocal: require("./lib/log/driver_local.js"),
  
    //repl
    repl: require("./lib/utiles/repl.js"),

    //cliTarea
    execTarea: require("./lib/utiles/tarea.js"),

    //bundler
    Bundle: require("./lib/utiles/bundle.js"),

	//Helper para construir Interfaces
	InterfazConstructor: require("./lib/utiles/interfaz.js"),
	
    
}
