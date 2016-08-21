var SerialPipe = require('./serialpipe'),
    HexPipe = require('./hexpipe'),
    net = require('net');

var sp = new SerialPipe();



var server = net.createServer(function (c) {
    // make per client
    var hexIn = new HexPipe({ prefix: "IN  > ", color: "yellow", dumpOnly: true }),
        hexOut = new HexPipe({ prefix: "OUT > ", color: "green", dumpOnly: true });

    console.log('client connected');
    sp.on('error', function (error) {
        console.log("sp on error");
        console.log(JSON.stringify(error));
    });
    c.on('end', function () {
        console.log('client onend');

        c.unpipe();
        hexIn.unpipe();
        sp.unpipe();
        hexOut.unpipe();

    });
    c.on('close', function () {
        //socket fully closed
        console.log('client onclose');
    });
    /*
    //c.write('hello');
    //c.pipe(c); //echo
    c.on('data', function (data) {
        console.log('got data:');
        console.log(data);
    });
    */
    // make new pipe ??
    c.pipe(hexIn).pipe(sp);
    sp.pipe(hexOut).pipe(c);
//    c.pipe(sp);
//    sp.pipe(c);
});

server.on('error', function (err) {
    throw err;
});

server.listen(3000, function () {
    console.log('listening on port 3000');
});
/*
sp.pipe(hexOut).pipe(process.stdout);

hexIn.pipe(sp);
hexIn.write(new Buffer([0x10,0x02,0x31,0x7e,0x94,0x10,0x03]));
//sp.write(new Uint8Array([0x10,0x02,0x31,0x7e,0x94,0x10,0x03]));

// kewl... this kind of works
setTimeout(function () {
    console.log("calling end");
    sp.close();
}, 2000);

*/

