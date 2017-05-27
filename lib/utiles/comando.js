"use strict";

const spawn = require("child_process").spawn;

class EjecutorComando{

    constructor(comando, args=[], opciones={}){

        this.comando = comando;
        this.args = args;
        this.opciones = opciones;

        if(opciones.soloSalida){

            this.datosStdout = "";

            this.opciones.stdout = (datos) => {

                this.datosStdout += datos;

            };
        }

        if(!this.opciones.stderr){

            this.datosStderr = "";

            this.opciones.stderr = (datos) => {

                this.datosStderr += datos;
            }
        }

    }

    lanzar(){

        return new Promise((cumplida, falla) => {

            let cmd = spawn(this.comando, this.args);

            this.setEventos(cmd, cumplida, falla);

        })
    }

    setEventos(cmd, cumplida, falla){

        let fDatosEnOut = this.opciones.stdout || function(){};
        let fDatosEnErr = this.opciones.stderr || function(){};

        cmd.stdout.on("data", (datos) => {
            fDatosEnOut(datos);
        })

        cmd.stderr.on("data", (datos) => {
            fDatosEnErr(datos);
        })

        cmd.on("close", (codigo) => {

            if(codigo !== 0) return falla(this.datosStderr, codigo);

            else             return cumplida(this.datosStdout);
        })

    }
}

module.exports = EjecutorComando;
