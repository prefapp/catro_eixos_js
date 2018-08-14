const Proceso = require("./nucleo/proceso.js");


function definirBootstrap(boots, claseBase){

    class PB extends claseBase{

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

            }).sort((a,b) => {

                let na = Number(a.match(/(\d+)/)[1])
                let nb = Number(b.match(/(\d+)/)[1])

                return na - nb

            })

            return p;
        }

    }

    return PB;
}


function Bootstrap(codigo, claseBase = Proceso){

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

    return definirBootstrap(metodosBoot, claseBase);
}


module.exports = Bootstrap;
