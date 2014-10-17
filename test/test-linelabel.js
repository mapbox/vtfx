var tape = require('tape');
var util = require('./util.js');
var linelabel = require('../fx/linelabel.js');

tape('orderby string', function(assert) {
    // Creates geojson with features in order B, A, C, null
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
            "properties": {"id": 1,"name": 'r3'}
        }]
    });

    vt.layers[0] = linelabel(vt.layers[0], {id:'linelabel', labelfield:'name'});

    assert.equal(vt.layers[0].features.length, 2, 'removes line + label from features');
    assert.equal(vt.layers[0].features[0].geometry.length, 10, 'longer line is retained');
    assert.equal(vt.layers[0].features[1].geometry.length, 8, 'short line with short label is retained');

    var after = util.toGeoJSON(vt);

    assert.equal(after.features[0].properties.id, 0, 'preserves order of tied features');
    assert.equal(after.features[1].properties.id, 1, 'preserves order of tied features');

    assert.end();
});
