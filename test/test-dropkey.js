var tape = require('tape');
var util = require('./util.js');
var dropkey = require('../fx/dropkey.js');

tape('drop name', function(assert) {
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

    vt.layers[0] = dropkey(vt.layers[0], {id:'dropkey', dropkey:'name'});
    var after = util.toGeoJSON(vt);
    assert.equal(after.features.length, 5, 'retains all features');

    after.features.forEach(function(feat) {
        assert.notOk(feat.properties.name, 'Ensure name has been dropped');
        assert.ok(feat.properties.id+1, 'Enusure id is retained');
    });

    assert.end();
});

