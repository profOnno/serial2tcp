(function () {
    var stream = require('stream'),
        util = require('util'),
        SerialPort = require('serialport'),
        Duplex = stream.Duplex; // || require('readable-stream').Duplex

    function SerialPipe(options) {
        if (!(this instanceof SerialPipe)) {
            return new SerialPipe(options);
        }
        var self = this;

        this.sp = new SerialPort('/dev/ttyUSB0', { 
            //        baudrate: 9600,
            baudrate: 230400,      
            parser: SerialPort.parsers.raw
        });

        this.sp.on('open', function (err) {
            if(err) {
                console.log("Error serialport:", err.message);
                return
            }
            console.log("SerialPort open");
            self.uncork();
            //bind functions
        });

        this.sp.on('error', function(err) {
            console.log("error enven serialport:", err.message);
        });

        this.sp.on('data', function (data) {
            //    console.log("data: ", data.toString());
            console.log("in sp on data: ", data);
            self.readArr.push(data); // should go out  

        });

        Duplex.call(this, options);
        this.readArr = [];

        // opening serialport is async... 
        // put a cork on it and wait for 'connected' event to uncork
        self.cork();
    }
    util.inherits(SerialPipe, Duplex);

    SerialPipe.prototype._read = function readBytes(n) {
        var self = this;
        while (this.readArr.length) {
            var chunk = this.readArr.shift();
            if(!self.push(chunk)) {
                break; // false from push stop reading
            }
        }
    };

    SerialPipe.prototype._write = function (chunk, enc, cb) {
        // test if serial port connected..
        var self = this;

        self.sp.write(chunk.buffer); //write it straigth through
        cb();
    };

    var duplex = new SerialPipe();
    //setTimeout(function () {

        duplex.on('readable', function () {
            var chunk;
            while (null !== (chunk = duplex.read())) {
                console.log('read: ', chunk.toString());
            }
        });

        //duplex.write('Hello');
        //duplex.write('World');
        duplex.write(new Buffer(new Uint8Array([0x10,0x02,0x31,0x7e,0x94,0x10,0x03])));
        duplex.write(new Buffer(new Uint8Array([0x10,0x02,0x31,0x7e,0x94,0x10,0x03])));
        duplex.write(new Buffer(new Uint8Array([0x10,0x02,0x31,0x7e,0x94,0x10,0x03])));
        duplex.write(new Buffer(new Uint8Array([0x10,0x02,0x31,0x7e,0x94,0x10,0x03])));
        setTimeout(function () {
            duplex.end();
        }, 2000);

    module.exports = SerialPipe;
}());
