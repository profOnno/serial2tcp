var SerialPipe = require('./serialpipe'),
    HexPipe = require('./hexpipe'),
    net = require('net'),
    SerialPort = require('serialport'), 
    argv = require('yargs')
        .usage("zoek 't maar uit")
        .demand(['s', 'b', 'p'])
        .alias('s','serialport')
        .describe('s', 'comx or /dev/ttyUSBx')
        .alias('b','baudrate')
        .describe('b', '2400, 9600, 14400..etc')
        .alias('p','tcpport')
        .describe('p', 'tcp port to listen on.')
        .argv;

var sp = new SerialPipe(argv.s, {
                baudrate: argv.b,
                parser: SerialPort.parsers.raw
            });



var server = net.createServer(function (c) {
    // make per client
    var hexIn = new HexPipe({ prefix: "OUT  > ", color: "yellow", dumpOnly: true }),
        hexOut = new HexPipe({ prefix: "IN > ", color: "green", dumpOnly: true });

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

server.listen(argv.p, function () {
    console.log('listening on port ', argv.p);
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

            baudrate: 230400,      
*/

