var net = require('net');

var client = net.connect({ port: 8066 }, function () {
    console.log('connected to server!');

    client.write(new Buffer([0x10,0x02,0x31,0x7e,0x94,0x10,0x03]));
});

client.on('data', function (data) {
    console.log(data);
});

client.on('end', function () {
    console.log('disconnected from server!');
});
