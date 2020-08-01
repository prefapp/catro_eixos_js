function b(){

    return new Promise((c) => {

    })
}

async function a(){

    await b();

}

a().then(() => {

    console.log(`Continuo`)

})
