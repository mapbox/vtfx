var tape = require('tape');
var util = require('./util.js');
var orderby = require('../fx/orderby.js');

tape('orderby error', function(assert) {
    var vt = util.fromGeoJSON({
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {"type": "Point","coordinates": [0,0]}
        }]
    });
    assert.throws(function() {
        orderby(vt.layers[0], {id:'orderby', sort:1});
    }, /field is not set/, 'throws when options.field is not set');
    assert.throws(function() {
        orderby(vt.layers[0], {id:'orderby', field:'doesnotexist', sort:1});
    }, /field doesnotexist does not exist/, 'throws when field is set to invalid value');
    assert.end();
});

tape('orderby string', function(assert) {
    // Creates geojson with features in order B, A, C, null
    var vt = util.fromGeoJSON({
        "type": "FeatureCollection",
        "features": ['apples','Bananas','apples','cartography',null].map(function(val,i) {
            return {
                "type": "Feature",
                "geometry": {"type": "Point","coordinates": [0,0]},
                "properties": {"id":i,"name":val}
            }
        })
    });

    var after;

    vt.layers[0] = orderby(vt.layers[0], {id:'orderby', field:'name', sort:1});
    after = util.toGeoJSON(vt);
    assert.equal(after.features.length, 5, 'retains all features');
    ['','apples','apples','Bananas','cartography'].forEach(function(expected, i) {
        assert.equal(after.features[i].properties.name, expected, 'sorted: ' + expected);
    });
    assert.equal(after.features[1].properties.id, 0, 'preserves order of tied features');
    assert.equal(after.features[2].properties.id, 2, 'preserves order of tied features');

    vt.layers[0] = orderby(vt.layers[0], {id:'orderby', field:'name', sort:-1});
    after = util.toGeoJSON(vt);
    assert.equal(after.features.length, 5, 'retains all features');
    ['cartography','Bananas','apples','apples',''].forEach(function(expected, i) {
        assert.equal(after.features[i].properties.name, expected, 'sorted: ' + expected);
    });
    assert.equal(after.features[2].properties.id, 0, 'preserves order of tied features');
    assert.equal(after.features[3].properties.id, 2, 'preserves order of tied features');

    assert.end();
});

tape('orderby number', function(assert) {
    // Creates geojson with features in order B, A, C
    var vt = util.fromGeoJSON({
        "type": "FeatureCollection",
        "features": [0,500,15,0,-20,15.5].map(function(val,i) {
            return {
                "type": "Feature",
                "geometry": {"type": "Point","coordinates": [0,0]},
                "properties": {"id":i,"ele":val}
            }
        })
    });

    var after;

    vt.layers[0] = orderby(vt.layers[0], {id:'orderby', field:'ele', sort:1});
    after = util.toGeoJSON(vt);
    assert.equal(after.features.length, 6, 'retains all features');
    [-20,0,0,15,15.5,500].forEach(function(expected, i) {
        assert.equal(after.features[i].properties.ele, expected, 'sorted: ' + expected);
    });
    assert.equal(after.features[1].properties.id, 0, 'preserves order of tied features');
    assert.equal(after.features[2].properties.id, 3, 'preserves order of tied features');

    vt.layers[0] = orderby(vt.layers[0], {id:'orderby', field:'ele', sort:-1});
    after = util.toGeoJSON(vt);
    assert.equal(after.features.length, 6, 'retains all features');
    [500,15.5,15,0,0,-20].forEach(function(expected, i) {
        assert.equal(after.features[i].properties.ele, expected, 'sorted: ' + expected);
    });
    assert.equal(after.features[3].properties.id, 0, 'preserves order of tied features');
    assert.equal(after.features[4].properties.id, 3, 'preserves order of tied features');

    assert.end();
});
