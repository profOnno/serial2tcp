var SerialPipe = require('./serialpipe'),
    HexPipe = require('./hexpipe');

var sp = new SerialPipe(),
    hexIn = new HexPipe({ color: "yellow", dumpOnly: true }),
    hexOut = new HexPipe({ color: "green", dumpOnly: false });



//sp.on('readable', function () {
/*
 * sp.on('readable', function () {
    var chunk;
    while (null !== (chunk = sp.read())) {
        console.log('read: ', chunk.toString());
    }
});
*/


sp.pipe(hexOut).pipe(process.stdout);

hexIn.pipe(sp);
hexIn.write(new Buffer([0x10,0x02,0x31,0x7e,0x94,0x10,0x03]));
//sp.write(new Uint8Array([0x10,0x02,0x31,0x7e,0x94,0x10,0x03]));

// kewl... this kind of works
setTimeout(function () {
    console.log("calling end");
    sp.close();
}, 2000);


