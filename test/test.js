var fs = require('fs');
var tape = require('tape');
var vtfx = require('../index.js');
var beforepbf = fs.readFileSync(__dirname + '/before.pbf');
var mapnik = require('mapnik');

tape('before', function(t) {
    var vt = new mapnik.VectorTile(14,2621,6331);
    vt.setData(beforepbf);
    vt.parse();
    fs.writeFileSync(__dirname + '/before-poi_label.json', JSON.stringify(vt.toGeoJSON('poi_label'), null, 2));
    t.end();
});

tape('process tile', function(t) {
    vtfx(beforepbf, {'poi_label':{ limit:100 }}, function(err, afterpbf) {
        t.ifError(err);
        fs.writeFileSync(__dirname + '/after.pbf', afterpbf);

        var vt = new mapnik.VectorTile(14,2621,6331);
        vt.setData(afterpbf);
        vt.parse();
        fs.writeFileSync(__dirname + '/after-poi_label.json', JSON.stringify(vt.toGeoJSON('poi_label'), null, 2));
        t.end();
    });
});

