/*
 * https://nodejs.org/api/stream.html#stream_class_stream_transform
 */
(function () {

    var Transform = require('stream').Transform,
        util = require('util'),
        colors = require('colors');

    // All Transform streams are also Duplex Streams
   //const hexPipe = new Transform({
   function HexPipe(options) {
        this.options = options || {};
        this.color = this.options.color;
        this.dumpOnly = this.options.dumpOnly || false;
        this.prefix = this.options.prefix || "";


        Transform.call(this, {
       // exports.hexPipe = new Transform({
            //writableObjectMode: true,
            objectMode: true,

            transform(chunk, encoding, callback) {
              // Coerce the chunk to a number if necessary
                if (!this.dumpOnly) {
                    chunk = chunk || [];
                }

              // Transform the chunk into something else.
     //         const data = chunk.toString(16);
                var convert = function ( data ) {
                    var res = data.toString(16);
                    return '0'.repeat(res.length % 2) + res;
                };
     
                var newData = chunk.reduce(function (a, b) {
                    return (typeof a !== 'string') ?  convert(a) + " " + convert(b) :  a + " " + convert(b);
                });

              // Push the data onto the readable queue.
              //callback(null, '0'.repeat(data.length % 2) + data);
                if (this.dumpOnly) {
                    if (this.color) {
                        console.log(colors[this.color](this.prefix + newData + ' '));
                    } else {
                        console.log(this.prefix + newData + ' ');
                    }
                    callback(null, new Buffer(chunk));

                } else {
                    if (this.color) {
                        callback(null, colors[this.color](this.prefix + newData+' '));
                    } else {
                        callback(null, this.prefix + newData+' ');
                    }
                }
            }
        });

        //this.setEncoding('ascii');
    };
    util.inherits(HexPipe, Transform);

    
    module.exports = HexPipe;
}())


