"use strict";

var a = new Promise((c) => {c(1)});

a.then((n) => {
    console.log(n); throw 1;
    return 2;
}).then((n) => {
    console.log(n);
    return 3;
}).then((n) => {
    console.log(n); 
    return 4;
}).catch((e) => {
    console.log("ERROR", e);
})
