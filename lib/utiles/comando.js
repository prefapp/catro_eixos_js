"use strict";

const spawn = require("child_process").spawn;

const AC = require("../estado/acciones.js");

class EjecutorComando{

    constructor(comando, args=[], opciones={}){

        this.comando = comando;
        this.args = args;
        this.opciones = opciones;
        this.trazado = opciones.__trazado__ || false;

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

        this.trazado && this.trazado.accion(

            AC.EJECUTANDO_COMANDO(
                this.comando,
                this.args
            )

        );

        if(this.opciones.logLineaComando){
            this.opciones.logLineaComando(this.comando, this.args);
        }

        return new Promise((cumplida, falla) => {

            let cmd = spawn(this.comando, this.args, {

                TERM: "dumb",

                NODE_DISABLE_COLORS: "1",

                cwd: this.opciones.cwd,

                env: this.opciones.env

            });

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

            let salida = this.datosStdout + this.datosStderr;

            if(codigo !== 0) return falla(salida || `ERROR_DESCONOCIDO codigo: ${codigo}`, codigo);

            else             return cumplida(this.datosStdout);
        })

        cmd.on("error", (err) => {
            return falla(err);
        })
    }
}

module.exports = EjecutorComando;
