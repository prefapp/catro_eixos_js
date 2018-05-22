const {expect} = require("chai");

const {Fan} = require("../../lib/nucleo/fan");

describe("Fan - tareas", function(){

    
    it("Permite paralelizar tareas", function(){

        this.timeout(0);

        let elementos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''); 

        let i = 0;

        return new Fan(
            
            3,

            //alimentador
            function(){
        
                return elementos[i++]

            },

        ).ejecutar(

            //worker
            function(letra){

                return new Promise((cumplida) => {

                    setTimeout(function(){

 //                       console.log("EIQUI CON "+ letra)

                        cumplida(letra.toLowerCase());

                    }, 500)

                })

            }

        ).then((resultados) => {

            expect(resultados).to.be.an("array");

            expect(resultados.length).to.equal(elementos.length);

        })


    })

})
