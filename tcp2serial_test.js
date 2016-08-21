var net = require('net');

var client = net.connect({ port: 8066 }, function () {
    console.log('connected to server!');

//    client.write(new Buffer([0x10,0x02,0x31,0x7e,0x94,0x10,0x03]));
    setInterval(function () {
        console.log("*************************************************************");
        client.write(new Buffer([0x10,0x02,0x31,0x7e,0x94,0x10,0x03]));
    }, 1000);
});

client.on('data', function (data) {
    console.log("got data:");
    console.log(data);
});

client.on('end', function () {
    console.log('disconnected from server!');
});
