const {init} = require("../../index.js");

module.exports = function(){

    const bundle = (process.env["BUNDLER"]) ? false : require("/tmp/catro_eixos_test_bundle.js")

    return init({

        "B": __dirname + "/bundler"


    }, {

        EN_BUNDLE: bundle

    })


}
