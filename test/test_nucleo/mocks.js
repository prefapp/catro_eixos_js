const {expect} = require("chai");

const {init} = require("../../index.js");

const {Tarea} = require("../../index.js");

describe("Procesador - Mocks", function(){

    let refProcesador;

    before(function(){
     
        return init({
        
            "Test": __dirname  + "/../fixtures/mocks"
        
        }).then((r) => {
            
            refProcesador = r;
            
        })
        
    })

    it("Carga normalmente el proceso", function(){
        
        return refProcesador.ejecutar(
        
            new Tarea("", {
             
                proceso: "Test.a",

                a: 1,

                b: 1,   

                mock: false,
                
            })        
                
        ).then(({resultados}) => {
         
            expect(resultados.suma).to.equal(2);
            expect(resultados.mock).to.equal(undefined);
            
        })
        
    })
    

    it("Carga el proceso mock", function(){
        
        return refProcesador.ejecutar(
        
            new Tarea("", {
             
                proceso: "Test.a",

                a: 1,

                b: 1,   

                mock: true,
                
            })        
                
        ).then(({resultados}) => {
         
            expect(resultados.suma).to.equal(4);
            expect(resultados.mock).to.equal(true);
            
        })
        
    })

    it("Se puede controlar desde el proceso init", function(){
 
        return init({
        
            "Test": __dirname + "/../fixtures/mocks"
        
        }, {
         
            MOCKS: true   
            
        }).then((refProcesador) => {
            
            return refProcesador.ejecutar(
            
                new Tarea("", {
                
                    proceso: "Test.a",

                    a: 1,

                    b: 1,

                    mock: false,
                
                })   
                    
            ).then(({resultados}) => {
                
                expect(resultados.suma).to.equal(4);
                expect(resultados.mock).to.equal(true);
                
            })
            
            
        })      
        
    })
    
})
