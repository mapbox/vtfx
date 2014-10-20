var tape = require('tape');
var util = require('./util.js');
var dropinvalid = require('../fx/dropinvalid.js');

tape('drop single invalid geom', function(assert) {
    // Creates geojson with features where the line segment is long enough to be labeled with the given string
    var vt = util.fromGeoJSON({
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        -17.578125,
                        70.37785394109224
                    ],
                    [
                        -53.78906249999999,
                        18.979025953255267
                    ],
                    [
                        33.3984375,
                        7.013667927566642
                    ],
                    [
                        -58.35937499999999,
                        61.60639637138628
                    ],
                    [
                        -17.578125,
                        70.37785394109224
                    ]
                ]
            ]
        }
    });

    vt.layers[0] = dropinvalid(vt.layers[0], {id:'dropinvalid'});
    var after = util.toGeoJSON(vt);
    
    assert.deepEquals(after, JSON.parse('{"type":"FeatureCollection","features":[],"name":"layer"}'));

    assert.end();
});

tape('valid geom', function(assert) {
    // Creates geojson with features where the line segment is long enough to be labeled with the given string
    var vt = util.fromGeoJSON({
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                    -41.484375,
                     57.136239319177434
                    ],
                    [
                        22.8515625,
                        51.6180165487737
                    ],
                    [
                        -1.7578125,
                        -24.5271348225978
                    ],
                    [
                        -52.3828125,
                        18.646245142670608
                    ],
                    [
                        -41.484375,
                        57.136239319177434
                    ]
                ]
            ]
        }
    });

    vt.layers[0] = dropinvalid(vt.layers[0], {id:'dropinvalid'});
    var after = util.toGeoJSON(vt);

    assert.deepEquals(after, JSON.parse('{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-41.484374999999986,57.136239319177434],[22.85156250000002,51.6180165487737],[-1.7578124999999813,-24.5271348225978],[-52.38281249999999,18.646245142670608],[-41.484374999999986,57.136239319177434],[-41.484374999999986,57.136239319177434]]]},"properties":{}}],"name":"layer"}'));

    assert.end();
});
