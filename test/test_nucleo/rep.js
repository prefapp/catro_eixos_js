const {expect} = require("chai");

const ProcesoRep = require("../fixtures/proceso_rep.js");


const {Tarea} = require("../../index.js");

describe("Núcleo - Rep", function(){

    it("Permite la ejecución de un rep simple", function(){

        return new ProcesoRep(

            new Tarea("ejemplo", {

                maximo : 10,
                conPromises: true,

            })

        ).ejecutar().then(({resultados}) => {

            expect(resultados.resultado).to.equal(10);
            expect(resultados.PRE).to.equal(10);

        })
    })

    it("Permite la ejecutar de un rep largo", function(){

        this.timeout(0);
        
        return new ProcesoRep(

            new Tarea("ejemplo", {

                maximo : 100000

            })

        ).ejecutar().then(({resultados}) => {

            expect(resultados.resultado).to.equal(100000);
            expect(resultados.PRE).to.equal(10);

        })

    })

})
