var protobuf = require('protocol-buffers');
var path = require('path');
var fs = require('fs');

// Gross!
var proto = fs.readFileSync(path.dirname(require.resolve('mapnik-vector-tile')) + '/proto/vector_tile.proto', 'utf8');
proto = proto.replace('package mapnik.vector;', '');
proto = proto.replace('optional uint64 id = 1;', 'optional int64 id = 1;');
proto = proto.replace('option optimize_for = LITE_RUNTIME;', '');
proto = proto.replace('extensions 8 to max;', '');
proto = proto.replace('extensions 16 to max;', '');
proto = proto.replace('extensions 16 to 8191;', '');
var mvt = protobuf(proto);

module.exports = vtfx;
module.processors = {};
module.processors.drop = require('./fx/drop');
module.processors.labelgrid = require('./fx/labelgrid');
module.processors.labelgrid = require('./fx/orderby');

// This function is async in prep for needing to use workers.
// All fx processors should be js and sync for now.
function vtfx(data, options, callback) {
    if (!Buffer.isBuffer(data)) return callback(new Error('data must be a buffer'));
    if (typeof options !== 'object') return callback(new Error('options must be an object'));

    var changed = false;
    var vt = mvt.tile.decode(data);

    for (var i = 0; i < vt.layers.length; i++) {
        var name = vt.layers[i].name;
        if (!Array.isArray(options[name])) continue;
        for (var j = 0; j < options[name].length; j++) {
            var fxopts = options[name][j];
            if (!module.processors[fxopts.id]) continue;
            vt.layers[i] = module.processors[fxopts.id](vt.layers[i], fxopts);
            changed = true;
        }
    }

    callback(null, changed ? mvt.tile.encode(vt) : data);
}

