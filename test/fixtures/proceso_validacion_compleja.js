const {Proceso} = require("../../index.js");

module.exports = class extends Proceso{

    parametrosNecesarios(){

        return {

            numero: Number,

            nombre: String,

            f: Function,

            a: Array,

            o: Object,

            especial: {

                validacion: (t) => {

                    return t.match(/^[G|F|A]$/)

                }

            }


        }

    }

    __r(){

        return [

        ]

    }

}
