"use strict";

const CatroEixos = require("../../index.js");

class FamiliaA extends CatroEixos.FamiliaProcesos {
    
    constructor(){
            
        super("A", __dirname + "/familia_a");
    }

}

module.exports = FamiliaA;
