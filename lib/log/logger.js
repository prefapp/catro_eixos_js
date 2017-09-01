var winston = require("winston");

module.exports = class{

    constructor(nivel, opciones){

        this.logger = new winston.Logger({

            transports: [
                new winston.transports.Console(this.formato())
            ],

            level: nivel,

        });

        //console.log(this.logger);

        if(opciones.enInicio){
            opciones.enInicio(this.logger);
        }        

    }

    log(mensaje, nivel="info"){
        this.logger.log(nivel, mensaje);
    }

    formato(){
        return {
            colorize: true,
            timestamp: function() {
                return Date.now();
            },
            formatter: function(options) {

                options.meta.meta = options.meta.meta || {};

                return [
                    options.timestamp(),
                    options.level.toUpperCase(),
                    options.meta.id || "",
                    options.meta.motivo || "",
                    options.meta.divisa || "",
                    JSON.stringify(options.meta.meta) 
                    
                ].join(" ")

                // Return string will be passed to logger.
               // return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.divisa ? options.divisa : '') +
               // (options.meta && Object.keys(options.meta).length ? ''+ JSON.stringify(options.meta) : '' );
            }
        }
    }
}
