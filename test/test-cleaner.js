var tape = require('tape');
var util = require('./util.js');
var cleaner = require('../fx/cleaner.js');
var vtfx = require('../index.js');

tape('cleaner cleans drop 5', function(assert) {
    // Cleans up dereferenced keys and values for deleted features
    var vt = util.fromGeoJSON({
        "type": "FeatureCollection",
        "features": ['oak', 'maple', 'birch', 'teak', 'aspen', 'beech', 'dogwood', 'chestnut', 'sycamore', 'ash', 'apples','Bananas','apples','cartography', null].map(function(val,i) {
            return {
                "type": "Feature",
                "geometry": {"type": "Point","coordinates": [0,0]},
                "properties": {"id":i,"name":val}
            }
        })
    });

    vt.layers[0].features.splice(-5, 5);
    var after;

    vt.layers[0] = cleaner(vt.layers[0]);
    after = vt.layers[0];
    assert.equal(after.keys.length, 2, 'retains 2 keys');
    assert.equal(after.features.length, 10, 'retains 10 features');
    assert.equal(after.values.length, 20, 'retains 20 values');

    ['id', 'name'].forEach(function(expected, i) {
        assert.equal(after.keys[i], expected, 'key retained: ' + expected);
    });

    var expected = ['oak', 'maple', 'birch', 'teak', 'aspen', 'beech', 'dogwood', 'chestnut', 'sycamore', 'ash'];
    for (var i = 0; i < after.values.length; i += 2){
        var ix = i/2;
        assert.equal(after.values[i].int_value, ix, 'index value kept: ' + ix);
        assert.equal(after.values[i+1].string_value, expected[ix], 'name value kept: ' + expected[ix]);
    }

    assert.end();
});

tape('cleaner cleans removed feature and reindexes', function(assert) {
    // Cleans up dereferenced keys and values for deleted features and reindexes feature tags
    var vt = util.fromGeoJSON({
        "type": "FeatureCollection",
        "features": ['oak', 'cat', 'maple', 'birch', 'teak', 'aspen', 'beech', 'dogwood', 'chestnut', 'sycamore', 'ash'].map(function(val,i) {
            return {
                "type": "Feature",
                "geometry": {"type": "Point","coordinates": [0,0]},
                "properties": {"id":i,"name":val}
            }
        })
    });

    vt.layers[0].features.splice(1, 1);
    var after;

    vt.layers[0] = cleaner(vt.layers[0]);
    after = vt.layers[0];
    assert.equal(after.keys.length, 2, 'retains 2 keys');
    assert.equal(after.features.length, 10, 'retains 10 features');
    assert.equal(after.values.length, 20, 'retains 20 values');
    ['id', 'name'].forEach(function(expected, i) {
        assert.equal(after.keys[i], expected, 'key retained: ' + expected);
    });
    var expected = ['oak', 'maple', 'birch', 'teak', 'aspen', 'beech', 'dogwood', 'chestnut', 'sycamore', 'ash'];
    for (var i = 0; i < after.values.length; i += 2){
        var ix = i/2;
        assert.equal(after.values[i+1].string_value, expected[ix], 'name value kept: ' + expected[ix]);
    }

    expected = [ 0, 0, 1, 1 ];
    after.features.forEach(function(actual, i){
        for (var i = 0; i < actual.tags.length; i += 1){
            assert.equal(actual.tags[i], expected[i], 'reindexes tags');
        }
        expected = expected.map(function(item, i){
            if (i % 2) return item += 2;
            return item;
        })
    });


    assert.end();
});


