var HexPipe = require('./hexpipe');


//console.log(hp);
//var hp = new HexPipe();
var hp = new HexPipe({ dumpOnly: true });
    hp2 = new HexPipe({ prefix: "HP2: ", color: "yellow", dumpOnly: true }); 
    hp3 = new HexPipe({ prefix: "HP3: ", color: "green", dumpOnly: false }); 
//hp.setEncoding('ascii');
//hp.on('data', (chunk) => console.log("hp:",chunk));
//hp2.on('data', (chunk) => console.log("hp2:",chunk));

hp.pipe(hp2).pipe(hp3).pipe(process.stdout);
//hp3.pipe(process.stdout);

var theAr = new Uint8Array([4,23,5,33]);
//var theAr = new Uint8Array([3,2]);
console.log(theAr);

hp.write(theAr);
