var fs = require('fs');
var tape = require('tape');
var vtfx = require('../index.js');
var beforepbf = fs.readFileSync(__dirname + '/before.pbf');
var mapnik = require('mapnik');
var UPDATE = process.env.UPDATE;

tape('before', function(t) {
    var vt = new mapnik.VectorTile(14,2621,6331);
    vt.setData(beforepbf);
    vt.parse();
    jsonEqual(vt.toGeoJSON('poi_label'), __dirname + '/before-poi_label.json', t);

    t.end();
});

tape('drop', function(t) {
    vtfx(beforepbf, {'poi_label':[{id:'drop', limit:100}]}, function(err, afterpbf) {
        t.ifError(err);
        pbfEqual(afterpbf, __dirname + '/after-drop.pbf', t);

        var vt = new mapnik.VectorTile(14,2621,6331);
        vt.setData(afterpbf);
        vt.parse();
        jsonEqual(vt.toGeoJSON('poi_label'), __dirname + '/after-drop-poi_label.json', t);

        t.end();
    });
});

tape('drop err', function(t) {
    vtfx(beforepbf, {'poi_label':[{id:'drop', limit:'asdf'}]}, function(err, afterpbf) {
        t.equal(err.toString(), 'Error: options.limit must be a number');
        t.end();
    });
});

tape('labelgrid', function(t) {
    vtfx(beforepbf, {'poi_label':[{id:'labelgrid', size:1024}]}, function(err, afterpbf) {
        pbfEqual(afterpbf, __dirname + '/after-labelgrid-poi_label.pbf', t);

        var vt = new mapnik.VectorTile(14,2621,6331);
        vt.setData(afterpbf);
        vt.parse();
        jsonEqual(vt.toGeoJSON('poi_label'), __dirname + '/after-labelgrid-poi_label.json', t);

        t.end();
    });
});

tape('orderby', function(t) {
    vtfx(beforepbf, {'poi_label':[{id:'orderby', field:'scalerank'}]}, function(err, afterpbf) {
        pbfEqual(afterpbf, __dirname + '/after-orderby-poi_label.pbf', t);

        var vt = new mapnik.VectorTile(14,2621,6331);
        vt.setData(afterpbf);
        vt.parse();
        jsonEqual(vt.toGeoJSON('poi_label'), __dirname + '/after-orderby-poi_label.json', t);

        t.end();
    });
});

tape('linelabel', function(t) {
    vtfx(beforepbf, {'road':[{id:'linelabel', labelfield:'class'}]}, function(err, afterpbf) {
        pbfEqual(afterpbf, __dirname + '/after-linelabel-road.pbf', t);

        var vt = new mapnik.VectorTile(14,2621,6331);
        vt.setData(afterpbf);
        vt.parse();
        jsonEqual(vt.toGeoJSON('road'), __dirname + '/after-linelabel-road.json', t);

        t.end();
    });
});

// tape('generate garbage collection test fix', function(t) {
//     vtfx(fs.readFileSync(__dirname + '/before.pbf'), {'poi_label':[{id:'drop', limit:10}]}, function(err, afterpbf) {
//         pbfEqual(afterpbf, __dirname + '/before-garbage.pbf', t);

//         var vt = new mapnik.VectorTile(14,2621,6331);
//         vt.setData(afterpbf);
//         vt.parse();
//         jsonEqual(vt.toGeoJSON('poi_label'), __dirname + '/before-garbage.json', t);

//         t.end();
//     });
// });

tape('garbage collection', function(t) {
    var protobuf = require('protocol-buffers');
    var path = require('path');
    var beforeGarbagepbf = fs.readFileSync(__dirname + '/before-garbage.pbf');
    var cleaner = require('../fx/cleaner_change_index');

    // Gross!
    var proto = fs.readFileSync(path.dirname(require.resolve('mapnik-vector-tile')) + '/proto/vector_tile.proto', 'utf8');
    proto = proto.replace('package mapnik.vector;', '');
    proto = proto.replace('optional uint64 id = 1;', 'optional int64 id = 1;');
    proto = proto.replace('option optimize_for = LITE_RUNTIME;', '');
    proto = proto.replace('extensions 8 to max;', '');
    proto = proto.replace('extensions 16 to max;', '');
    proto = proto.replace('extensions 16 to 8191;', '');
    var mvt = protobuf(proto);

    var tile = mvt.tile.decode(beforeGarbagepbf);

    for (var i = 0; i < tile.layers.length; i++) {
        // should the garbage collector be called for all layers or just modified ones?
        // if just modified ones... when? After each filter or at the end of all?
        var layer = tile.layers[i],
            name = layer.name;

        if (name === 'poi_label'){
            cleaner(layer);
            jsonEqual(layer, __dirname + '/after-garbage-poi_label(drop).json', t, false);

            // reconstruct the features
            var features = [];
            for (var ix = 0; ix < layer.features.length; ix++){
                var feature = layer.features[ix];
                features.push({properties: {}})
                for (var iz = 0; iz < feature.tags.length; iz+= 2){
                    var values = Object.keys(layer.values[feature.tags[ix+1]]),
                        value;
                    for (var iy = 0; iy < values.length; iy++){
                        if (layer.values[feature.tags[iz+1]][values[iy]] != null) value = layer.values[feature.tags[iz+1]][values[iy]];
                    }
                    features[ix].properties[layer.keys[feature.tags[iz]]] = value;
                }
            }
            jsonEqual(features, __dirname + '/after-garbage-poi_label(drop)-reconstructed.json', t, false);
        }
    }
    var afterpbf = mvt.tile.encode(tile);
    pbfEqual(afterpbf, __dirname + '/after-garbage-poi_label(drop).pbf', t);

    t.end();
});

function pbfEqual(buffer, filepath, assert) {
    if (UPDATE) fs.writeFileSync(filepath, buffer);
    assert.deepEqual(buffer, fs.readFileSync(filepath));
}

function jsonEqual(data, filepath, assert, encoded) {
    if (encoded !== false){
        if (Array.isArray(data.features)) {
            for (var i = 0; i < data.features.length; i++) {
                data.features[i].geometry.coordinates = precision(data.features[i].geometry.coordinates);
            }
        }
    }
    if (UPDATE) fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    assert.deepEqual(data, JSON.parse(fs.readFileSync(filepath)));
}

function precision(coords) {
    if (typeof coords[0] === 'number') {
        for (var i = 0; i < coords.length; i++) {
            coords[i] = parseFloat(coords[i].toFixed(10));
        }
    } else if (Array.isArray(coords[0])) {
        for (var i = 0; i < coords.length; i++) {
            coords[i] = precision(coords[i]);
        }
    } else {
        throw new Error('Unhandled coords type ' + (typeof coords[0]));
    }
    return coords;
}

