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

tape('by field', function(t) {
    vtfx(beforepbf, {'poi_label':[{id:'field', field:'type', value: 'Park'}]}, function(err, afterpbf) {
        t.end();
    });
});

function pbfEqual(buffer, filepath, assert) {
    if (UPDATE) fs.writeFileSync(filepath, buffer);
    assert.deepEqual(buffer, fs.readFileSync(filepath));
}

function jsonEqual(data, filepath, assert) {
    if (UPDATE) fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    assert.deepEqual(data, JSON.parse(fs.readFileSync(filepath)));
}

