const Proceso = require("./nucleo/proceso.js");


function definirBootstrap(boots){

    class PB extends Proceso{

        constructor(tarea){

            super(tarea);
    
            let _self = this;

            boots.forEach((b, i) => {

                _self["__boot_" + i] = () => {
                    let f = b.f.bind(this);
                    return f();
                };

                _self["OK__boot_" + i] = () => {
                    console.log(`[${b.mensaje}][OK]`);
                };
    
                _self["KO__boot_" + i] = (err) => {
                    this.error(`[${b.mensaje}][${err}]`);
                };
            })
     
        }

        __r(){

            let p = Object.keys(this).filter((k) => {

                return k.match(/^__boot_\d+/) && 

                    typeof this[k] === "function"

            })

            return p;
        }

    }

    return PB;
}


function Bootstrap(codigo){

    let metodosBoot = [];

    function boot(mensaje, codigo){
        metodosBoot.push({
            f: codigo,
            mensaje: mensaje
        });
    }

    codigo = Object.defineProperty(codigo, "boot", {
        value: boot
    });

    codigo.call(codigo);

    return definirBootstrap(metodosBoot);
}


module.exports = Bootstrap;
