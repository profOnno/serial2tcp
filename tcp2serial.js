var SerialPipe = require('./serialpipe'),
    HexPipe = require('./hexpipe'),
    net = require('net');

var sp = new SerialPipe(),
    hexIn = new HexPipe({ prefix: "IN  > ", color: "yellow", dumpOnly: true }),
    hexOut = new HexPipe({ prefix: "OUT > ", color: "green", dumpOnly: true });



var server = net.createServer(function (c) {
    console.log('client connected');
    c.on('end', function () {
        console.log('client disconnected');
    });
    /*
    //c.write('hello');
    //c.pipe(c); //echo
    c.on('data', function (data) {
        console.log('got data:');
        console.log(data);
    });
    */
    c.pipe(hexIn).pipe(sp);
    sp.pipe(hexOut).pipe(c);
});

server.on('error', function (err) {
    throw err;
});

server.listen(8066, function () {
    console.log('listening on port 8066');
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

