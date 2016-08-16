/*
 * https://nodejs.org/api/stream.html#stream_class_stream_transform
 */
(function () {
    const Transform = require('stream').Transform;

    // All Transform streams are also Duplex Streams
   const hexPipe = new Transform({
   // exports.hexPipe = new Transform({
        writableObjectMode: true,

          transform(chunk, encoding, callback) {
              // Coerce the chunk to a number if necessary
    //          chunk |= 0;

              // Transform the chunk into something else.
     //         const data = chunk.toString(16);
                var convert = function ( data ) {
                    var res = data.toString(16);
                    return '0'.repeat(res.length % 2) + res;
                };
     
                data = chunk.reduce(function (a, b) {
                    //console.log(a.toString(16));
                    //console.log("a: %s, b: %s",a,b);
                    if (typeof a !== 'string') {
                     //   console.log(convert(a))
                    };

                    //console.log(convert(b));
                    var res = (typeof a !== 'string') ?  convert(a) + " " + convert(b) :  a + " " + convert(b);
                    console.log("res = ",res);
                    return res;
                });

              // Push the data onto the readable queue.
              //callback(null, '0'.repeat(data.length % 2) + data);
              callback(null, '0'.repeat(data.length % 2) + data);
          }
    });

    hexPipe.setEncoding('ascii');
    hexPipe.on('data', (chunk) => console.log(chunk));

    hexPipe.write(new Uint8Array([1,6,23]));
    hexPipe.write(new Uint8Array([20,43,123,34,562,24,64]));
    
/*
    exports.hexPipe = function () {
        hexPipeTransform.setEncoding('ascii');
        return hexPipeTransform;
    };
    */
    
    module.exports = hexPipe;
}())


