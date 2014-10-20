var tape = require('tape');
var util = require('./util.js');
var linelabel = require('../fx/linelabel.js');

tape('linelabel by name', function(assert) {
    // Creates geojson with features where the line segment is long enough to be labeled with the given string
    var vt = util.fromGeoJSON({
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {"type": "LineString","coordinates": [[0,0], [0, 20], [0, 40], [0, 60]]},
            "properties": {"id": 0,"name": 'road one'}
        },
        {
            "type": "Feature",
            "geometry": {"type": "LineString","coordinates": [[0,0], [0, 1], [0, 2], [0, 3]]},
            "properties": {"id": 1,"name": 'road two'}
        },
        {
            "type": "Feature",
            "geometry": {"type": "LineString","coordinates": [[0,0], [0, 9], [0,10]]},
            "properties": {"id": 2,"name": 'r3'}
        }]
    });

    vt.layers[0] = linelabel(vt.layers[0], {id:'linelabel', labelfield:'name'});
    var after = util.toGeoJSON(vt);

    assert.equal(after.features[0].properties.id, 0, 'longer line is retained');
    assert.equal(after.features[1].properties.id, 2, 'short line with short label is retained');

    assert.end();
});
