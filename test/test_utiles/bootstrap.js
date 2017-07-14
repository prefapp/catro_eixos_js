const {expect} = require("chai");
const {ProcesoBootstrap, Tarea} = require("../../index.js");


describe("Bootstrap - Utiles", function(){

    it("Permite crear boostraps", function(hecho){

        let p = ProcesoBootstrap(function(){

            this.boot("carga 0", function(){
                this.resultado("pasos", []);
            })
        
            this.boot("carga 1", function(){
                this.tarea.resultados["pasos"].push(1);
            })
        
            this.boot("carga 2", function(){
                this.tarea.resultados["pasos"].push(2);
            })
        
        });

        new p(new Tarea())
            .ejecutar()
                .then(({resultados}) => {
                    expect(resultados.pasos).to.be.an("array");
                    expect(resultados.pasos[0]).to.be.equal(1);
                    expect(resultados.pasos[1]).to.be.equal(2);
                    hecho();
                })
                .catch((err) => {
                    console.log(err);
                    hecho(1);
                })
        
    })

})
