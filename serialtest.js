#!/usr/bin/env node

var SerialPort = require('serialport');

sp = new SerialPort('/dev/ttyUSB0', { 
//        baudrate: 9600,
        baudrate: 230400,      
        parser: SerialPort.parsers.raw
    });

sp.on('open', function (err) {
    if(err) {
        console.log("Error serialport:", err.message);
        return
    }
    console.log("SerialPort open");
});

sp.on('error', function(err) {
    console.log("error enven serialport:", err.message);
});

sp.on('data', function (data) {
//    console.log("data: ", data.toString());
    console.log("data: ", data);
});

setTimeout(function(){
//    sp.write('print("hello")\n');
    sp.write(new Uint8Array([0x10,0x02,0x31,0x7e,0x94,0x10,0x03]));
},200);

