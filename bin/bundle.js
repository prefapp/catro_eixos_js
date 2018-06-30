#!/usr/bin/env node

const init_ruta = process.argv[2];
const salida = process.argv[3];

const Bundle = require("../lib/utiles/bundle.js");

let init;

try{

    process.env["BUNDLER"] = true;

    init = require(init_ruta);

}
catch(err){

    console.log(`Error ${err}`)

    process.exit(1);

}

    Bundle(init, salida)

        .then(() => {

            process.exit(0);

        })

        .catch((err) => {

            console.log(`Error ${err}`)

            process.exit(1);

        })
