const {expect} = require("chai");

const ValidacionParametros = require("../../lib/nucleo/validacion_parametros.js");


describe("Núcleo - validación parametros", function(){

    it("Permite validar elementos no existentes y simples", function(){

        const args = {

            a: 1,
            b: "esto es una cadena",
            c: 3.1235,
            d: [],
            e: function(){},        
            o: {a: 1, b: 2},
            b: true
        };

        const validacion = {
            a: Number,
            b: String,
            c: Number,
            d: Array,
            e: Function,
            o: Object,
            b: Boolean
        }

        let error = null;

        let f = ValidacionParametros(validacion, function(e){
            error = e;
        }, args)

        expect(f).to.equal(true);
        expect(error).to.equal(null);

        delete args["c"];

        f = ValidacionParametros(validacion, function(e){
            error = e;
        }, args)

        expect(f).to.equal(false);
        expect(error).to.equal("Falta el parámetro c")

    })

    it("Permite validaciones complejas", function(){

        const args = {

            a: 88

        }

        const validaciones = {

            a: {

                validacion: function(a){

                    return a > 1 && a < 100

                }

            }

        }

        let error;
    
        let f = ValidacionParametros(validaciones, e => error = e, args)
        
        expect(f).to.equal(true);

        args.a = 101;

        f = ValidacionParametros(validaciones, e => error = e, args)
        
        expect(f).to.equal(false);
        expect(error).to.equal(`a no es válida (validacion especial)`)

    })


})
