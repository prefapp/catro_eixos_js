const {expect} = require("chai");

const ProcesoDormilon = require("../fixtures/procesos/proceso_dormilon.js");

const {Procesador} = require("../../index.js");

const {Tarea} = require("../../index.js");

describe("Procesador - Limites", function(){

    it("SE pueden poner limites a los procesos", function(hecho){

        this.timeout(50 * 1000 );

        let procesador = new Procesador(

            {
                "Dormir.dormilon" : ProcesoDormilon
            }, 

            {

                limites: {
                    "Dormir.dormilon": 20
                }

        });

        let dd = [];

        let promesas = Array.apply(null, { length: 1000 })

            .map((n, i) => {
        
            return procesador.ejecutar(

                new Tarea(

                    "foo" + i, 

                    {
                        proceso: "Dormir.dormilon", 
    
                        nombre: i,  
                    
                        duerme: 10,

                        enDespertar: (n) => {

                            if(n != 0){
                                expect(dd[dd.length - 1]).to.be.equal(n -1 );
                            }
        
                            dd.push(n);
                        }
                    }
                )
            )
        })
        
        Promise.all(promesas)

            .then((r) => {
                hecho();
            })
            .catch((err) => {
                console.log(err);
                hecho(1);
            })
    })

})
