"use strict";

const ProcesoBase = require("./proceso_base.js");

class ProcesoDepurado extends ProcesoBase{

    DEPURAR() {
        return true;
    }
}

module.exports = ProcesoDepurado;
