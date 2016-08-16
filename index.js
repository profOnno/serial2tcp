var stream = require('stream'),
    util = require('util'),
    SerialPort = require('serialport'),
    Duplex = stream.Duplex; // || require('readable-stream').Duplex

function DRTimeWLog(options) {
    if (!(this instanceof DRTimeWLog)) {
        return new DRTimeWLog(options);
    }

    this.sp = new SerialPort('/dev/ttyUSB0', { 
//        baudrate: 9600,
        baudrate: 230400,      
        parser: SerialPort.parsers.raw
    });


    Duplex.call(this, options);
    this.readArr = [];

    this.timer = setInterval(addTime, 1000, this.readArr);
}
util.inherits(DRTimeWLog, Duplex);

function addTime(readArr) {
    readArr.push((new Date()).toString());
}

DRTimeWLog.prototype._read = function readBytes(n) {
    var self = this;
    while (this.readArr.length) {
        var chunk = this.readArr.shift();
        if(!self.push(chunk)) {
            break; // false from push stop reading
        }
    }
    if (self.timer) {
        setTimeout(readBytes.bind(self), 1000,n);
    } else { // we are done, push null to end stream
        self.push(null);
    }
};

DRTimeWLog.prototype.stopTimer = function () {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
};

DRTimeWLog.prototype._write = function (chunk, enc, cb) {
    console.log('write: ', chunk.toString());
    cb();
};

var duplex = new DRTimeWLog();
duplex.on('readable', function () {
    var chunk;
    while (null !== (chunk = duplex.read())) {
        console.log('read: ', chunk.toString());
    }
});

duplex.write('Hello \n');
duplex.write('World');
duplex.end();

setTimeout(function () {
    duplex.stopTimer();
}, 5000);
