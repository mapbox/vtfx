var tape = require('tape');
var util = require('./util.js');
var drop = require('../fx/drop.js');

tape('drop error', function(assert) {
    var vt = util.fromGeoJSON({
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {"type": "Point","coordinates": [0,0]}
        }]
    });
    assert.throws(function() {
        drop(vt.layers[0], {id:'drop', limit:'hundred'});
    }, /options.limit must be a number/, 'throws when options.limit is set to invalid value');
    assert.end();
});

tape('drop limit 5', function(assert) {
    // Creates geojson with only the first 5 features preserved
    var vt = util.fromGeoJSON({
        "type": "FeatureCollection",
        "features": ['apples','Bananas','apples','cartography',null, 'oak', 'maple', 'birch'].map(function(val,i) {
            return {
                "type": "Feature",
                "geometry": {"type": "Point","coordinates": [0,0]},
                "properties": {"id":i,"name":val}
            }
        })
    });

    var after;

    vt.layers[0] = drop(vt.layers[0], {id:'drop', limit:5});
    after = util.toGeoJSON(vt);
    assert.equal(after.features.length, 5, 'keeps first five features');
    ['apples','Bananas','apples','cartography',''].forEach(function(expected, i) {
        assert.equal(after.features[i].properties.name, expected, 'kept: ' + expected);
    });
    assert.equal(after.features[0].properties.id, 0, 'preserves order of tied features');
    assert.equal(after.features[1].properties.id, 1, 'preserves order of tied features');

    assert.end();
});

tape('drop parameters', function(assert){
    var options = {id:'drop', limit: 5};

    var parameters = drop.parameters;
    assert.equal(parameters.name, options.id);
    delete options.id;

    assert.equal(Object.keys(options).length, parameters.options.length);
    for (var ix in parameters.options){
      assert.equal(parameters.options[ix].type, typeof options[parameters.options[ix].field]);
    }

    assert.ok(parameters.display, 'display field exists');
    assert.ok(parameters.description, 'description field exists');
    assert.end();
});