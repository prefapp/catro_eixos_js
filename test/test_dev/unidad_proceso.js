const {expect} = require("chai");

const UnidadProceso = require("../../lib/dev/unidad_proceso.js");

const ProcesoTest = require("../fixtures/procesos/proceso_test.js");

describe("Dev - TestUnidadProceso", function(){

    it("Unidad simple", function(hecho){
        
        new UnidadProceso(ProcesoTest)

            .ejecutar({cadena: "CIUDAD"})

            .dump()

            .evaluar({

                estado: "OK",
                salida: "Ciudad"

            }, hecho)
    })

    it("Unidad simple reescritura", function(hecho){

        new UnidadProceso(ProcesoTest)

            .ejecutar({cadena: "CIUDAD"})

            .silenciar([
                "self.__inicialAMayusculas"
            ])

            .dump()

            .evaluar({
                salida: "ciudad"
            }, hecho)
    })

    it("Unidad simple no se ve afectada", function(hecho){

        new UnidadProceso(ProcesoTest)

            .ejecutar({cadena: "CIUDAD"})

            .evaluar({estado: "OK", salida: "Ciudad"}, hecho)
    })

    it("Unidad permite crear stoppers", function(hecho){

        if(process.env["NODE_ENV"] !== "development") return hecho();

        this.timeout(60 * 60 * 60);
        
        new UnidadProceso(ProcesoTest)

            .ejecutar({cadena: "CIUDAD"})

            .detenerEn([

                "self.__cadenaAMinusculas",
                "self.__inicialAMayusculas",
            ])

            .evaluar({salida:"Ciudad"}, hecho)
    })

})
