const {expect} = require("chai");

const {exec} = require("child_process");

const fs = require("fs");

const webpack = require("webpack");

describe("Probando el bundle", function(){

    it("Se puede generar un bundle con los procesos", function(hecho){

        this.timeout(0);

        exec(

          "/usr/bin/env node ./bin/bundle.js ../test/fixtures/init.js /tmp/catro_eixos_test_bundle.js",

           {
    
            //cwd: __dirname + "../../"
            
            
           },
    

          (err) => {

            if(err) return hecho(err);

            expect(fs.existsSync("/tmp/catro_eixos_test_bundle.js")).to.equal(true);

            hecho();

          }

        )
        

    })

    it("Se puede compilar una aplicacion catro-eixos-js", function(hecho){

        this.timeout(0);

        webpack({

            entry: __dirname + "/../fixtures/bundle_entrada.js",

            output: {

                filename: "bundle.js",

                path: "/tmp"

            },

            target: "node"


        }, (err, stats) => {

            if(err) return hecho(err);

            expect(fs.existsSync("/tmp/bundle.js")).to.equal(true);

            return hecho();

        })

    })
    
    it("La aplicacion catro-eixos-js es funcional", function(hecho){

        this.timeout(0);

        exec(

            "/usr/bin/env node /tmp/bundle.js",

            (err) => {

                if(err) return hecho(err);

                expect(fs.existsSync("/tmp/test_bundle")).to.equal(true);

                return hecho();
            }

        )


    })


})
