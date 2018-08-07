const {Proceso} = require("../../index.js");

module.exports = class extends Proceso{

    parametrosNecesarios(){

        return ["maximo"]

    }

    __r(){

        return [
            "__sumador",
            "__apuntarResultados"
        ]

    }

    PRE__sumador(){

        this.resultado("PRE", 10);

    }

    REP__sumador(n, i){

        if(this.arg("conPromises"))
            return Promise.resolve(i < this.arg("maximo"))
        else
            return i < this.arg("maximo")
    }

    __sumador(n = 0){

        if(this.arg("conPromises")){
            return new Promise((cumplida, falla) => {
                setTimeout(cumplida(n + 1), 50);
            })
        }
        else{
            return n + 1;   
        }

    }

    __apuntarResultados(total){

        this.resultado("resultado", total);

    }


}
