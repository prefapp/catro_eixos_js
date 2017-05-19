"use strict";

const CatroEixos = require("../../index.js");

module.exports = {

    tarea: (proceso, args) => {

        args.proceso = proceso;

        return new CatroEixos.Tarea(null, args);

    }


};
