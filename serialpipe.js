(function () {
    var stream = require('stream'),
        util = require('util'),
        SerialPort = require('serialport'),
        Duplex = stream.Duplex; // || require('readable-stream').Duplex

    function SerialPipe(options) {
        if (!(this instanceof SerialPipe)) {
            return new SerialPipe(options);
        }

        var selfSP = this;

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
            selfSP.uncork();
            //bind functions
        });

        this.sp.on('error', function(err) {
            console.log("error enven serialport:", err.message);
        });

        this.sp.on('data', function (chunk) {
            var self = this;

            //console.log("sp on data: ", JSON.stringify(chunk));
            //console.log("in sp on data: ", data);
            /*selfSP.push(data); 
            self.flush(function () {
                console.log("flushed");
            });
            */
//            console.log("pushing data from serial port");
            selfSP.push(chunk); 
            //selfSP.readArr.push(chunk);
            //selfSP.read(0);// should activate reader
            //selfSP.resume(); // should trigger reader?
        

            // trigger read,,,?
        });

        Duplex.call(this, options);
        this.readArr = [];

        // opening serialport is async... 
        // put a cork on it and wait for 'connected' event to uncork
        selfSP.cork();

        selfSP.on('end', function () {
            console.log("end called stopit");
            selfSP.sp.close();
            // TODO cleanup
        });
    }
    util.inherits(SerialPipe, Duplex);

    SerialPipe.prototype.close = function () {
        var self = this;
        console.log("close called");
        self.push(null);
    }

    SerialPipe.prototype._read = function readBytes(n) {
        
        //console.log("read active:", n);
        
/*        var self = this;
        while (self.readArr.length) {
            var chunk = self.readArr.shift();
            if(!self.push(chunk)) {
                // TODO signal serial to stop.. disable CTS ?
                break; // false from push stop reading
            }
        }
        
 */       
        // how do we need this... single reads?? 
    };

    SerialPipe.prototype._write = function (chunk, enc, cb) {
        // test if serial port connected..
        var self = this;

        //console.log("in _write:", JSON.stringify(chunk));
        self.sp.write(chunk.buffer); //write it straigth through
        cb();
    };

    module.exports = SerialPipe;
}());
