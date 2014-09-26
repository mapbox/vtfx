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

function pbfEqual(buffer, filepath, assert) {
    if (UPDATE) fs.writeFileSync(filepath, buffer);
    assert.deepEqual(buffer, fs.readFileSync(filepath));
}

function jsonEqual(data, filepath, assert) {
    if (Array.isArray(data.features)) {
        for (var i = 0; i < data.features.length; i++) {
            data.features[i].geometry.coordinates = precision(data.features[i].geometry.coordinates);
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
            coords[i] = roundify(coords[i]);
        }
    } else {
        throw new Error('Unhandled coords type ' + (typeof coords[0]));
    }
    return coords;
}

