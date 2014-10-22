var tape = require('tape');
var util = require('./util.js');
var dropinvalid = require('../fx/dropinvalid.js');

tape('drop single invalid poly geom', function(assert) {
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

tape('keep single valid poly geom', function(assert) {
    // Creates geojson with features where the line segment is long enough to be labeled with the given string
    var vt = util.fromGeoJSON({
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        0,0
                    ],
                    [
                        0,1
                    ],
                    [
                        1,1
                    ],
                    [
                        1,0
                    ],
                    [
                        0,0
                    ]
                ]
            ]
        }
});

    vt.layers[0] = dropinvalid(vt.layers[0], {id:'dropinvalid'});
    var after = util.toGeoJSON(vt);
    assert.deepEquals(after.features[0], JSON.parse('{"type": "Feature","properties": {},"geometry": {"type": "Polygon","coordinates": [ [ [ 0, 0 ], [ 0, 0.9667509997666425 ], [ 0.9667968750000001, 0.9667509997666425 ], [ 0.9667968750000001, 0 ], [ 0, 0 ], [ 0, 0 ] ] ]}}'));
    assert.end();
});

tape('drop single invalid line geom', function(assert) {
    // Creates geojson with features where the line segment is long enough to be labeled with the given string
    var vt = util.fromGeoJSON({
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [
                    25.6640625,
                    75.75894014501688
                ],
                [
                    -42.1875,
                    45.583289756006316
                ],
                [
                    24.960937499999996,
                    2.8113711933311403
                ],
                [
                    -24.2578125,
                    74.59010800882325
                ]
            ]
        }
    });

    vt.layers[0] = dropinvalid(vt.layers[0], {id:'dropinvalid'});
    var after = util.toGeoJSON(vt);

    assert.deepEquals(after, JSON.parse('{"type":"FeatureCollection","features":[],"name":"layer"}'));

    assert.end();
});

tape('keep single valid line geom', function(assert) {
    // Creates geojson with features where the line segment is long enough to be labeled with the given string
    var vt = util.fromGeoJSON({
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            -16.171875,
            71.74643171904148
          ],
          [
            -43.2421875,
            45.089035564831036
          ],
          [
            -11.6015625,
            30.90222470517144
          ],
          [
            -18.984375,
            67.941650035336
          ],
          [
            -9.667968749999998,
            72.81607371878991
          ],
          [
            -18.80859375,
            73.22669969306126
          ],
          [
            -48.1640625,
            43.96119063892024
          ],
          [
            -9.84375,
            27.21555620902969
          ],
          [
            -7.207031249999999,
            32.10118973232094
          ],
          [
            -16.34765625,
            67.33986082559095
          ],
          [
            -6.6796875,
            73.12494524712693
          ],
          [
            -21.09375,
            74.16408546675687
          ],
          [
            -51.85546874999999,
            44.465151013519616
          ],
          [
            -10.8984375,
            24.5271348225978
          ]
        ]
      }
    });

    vt.layers[0] = dropinvalid(vt.layers[0], {id:'dropinvalid'});
    var after = util.toGeoJSON(vt);

    assert.deepEquals(after, JSON.parse('{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"LineString","coordinates":[[-16.171874999999993,71.74643171904148],[-43.24218749999999,45.089035564831036],[-11.601562499999988,30.90222470517144],[-18.984374999999986,67.941650035336],[-9.667968749999986,72.81607371878991],[-18.808593749999986,73.22669969306126],[-48.16406249999999,43.96119063892024],[-9.84374999999999,27.215556209029664],[-7.20703124999999,32.10118973232094],[-16.34765624999999,67.33986082559097],[-6.6796874999999885,73.12494524712693],[-21.093749999999993,74.16408546675687],[-51.85546874999999,44.465151013519616],[-10.898437499999986,24.52713482259779]]},"properties":{}}],"name":"layer"}'));

    assert.end();
});
