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

function vtfx(data, options, callback) {
    var vt = mvt.tile.decode(data);

    for (var i = 0; i < vt.layers.length; i++) {
        if (!options[vt.layers[i].name]) continue;
        var limit = options[vt.layers[i].name].limit || 50;
        vt.layers[i].features = vt.layers[i].features.slice(0,limit);
    }

    callback(null, mvt.tile.encode(vt));
}

