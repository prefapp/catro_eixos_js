const readline = require("readline");
const Reescritor = require("./reescritor.js");


module.exports = class extends Reescritor{

    aplicarStoppers(stoppers){

        const rl = this.__lector();

        this.__metodosPropios(stoppers, true)

            .forEach(s => this.__aplicarStopper(rl, s))
    }

    __aplicarStopper(rl, metodo, proceso){

        proceso = proceso || this.proceso;

        this.__reescribir(

            proceso,

            "DEV" + metodo,

            function(args){

                console.log(`\nMétodo ${metodo} ejecutado `);

                return new Promise((cumplida, falla) => {
                
                    rl.question("Pulsa tecla para continuar....", (respuesta) =>{

                        console.log("");
                        
                        return cumplida(args);

                    })

                })
            }

        )

    }

    __lector(){

        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return rl;
    }
}
