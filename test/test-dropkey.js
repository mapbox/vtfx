var tape = require('tape');
var util = require('./util.js');
var dropkey = require('../fx/dropkey.js');

tape('drop name', function(assert) {
    var vt = util.fromGeoJSON({
        "type": "FeatureCollection",
        "features": ['apples','Bananas','apples','cartography', 'canada'].map(function(val,i) {
            return {
                "type": "Feature",
                "geometry": {"type": "Point","coordinates": [0,0]},
                "properties": {"id":i,"name":val}
            }
        })
    });

    vt.layers[0] = dropkey(vt.layers[0], {id:'dropkey', options: [{field:'name'}]});
    var after = util.toGeoJSON(vt);
    assert.equal(after.features.length, 5, 'retains all features');

    after.features.forEach(function(feat) {
        assert.notOk(feat.properties.name, 'Ensure name has been dropped');
        assert.ok(feat.properties.id+1, 'Enusure id is retained');
    });

    assert.end();
});

tape('chained drop name', function(assert) {
    var vt = util.fromGeoJSON({
        "type": "FeatureCollection",
        "features": ['apples','Bananas','apples','cartography', 'canada'].map(function(val,i) {
            return {
                "type": "Feature",
                "geometry": {"type": "Point","coordinates": [0,0]},
                "properties": {"id":i,"name":val}
            }
        })
    });
            
    vt.layers[0] = dropkey(vt.layers[0], {id:'dropkey', options: [ { field: 'name' }, { field: 'id' } ]});
    var after = util.toGeoJSON(vt);
    assert.equal(after.features.length, 5, 'retains all features');
 
    after.features.forEach(function(feat) {
        assert.notOk(feat.properties.name, 'Ensure name has been dropped');
        assert.notOk(feat.properties.id, 'Ensure id has been dropped');
    });

    assert.end();
});

tape('chain remaining', function(assert) {                                                                    
    var vt = util.fromGeoJSON({
        "type": "FeatureCollection",
        "features": ['apples','Bananas','apples','cartography', 'canada'].map(function(val,i) {
            return {
                "type": "Feature", 
                "geometry": {"type": "Point","coordinates": [0,0]},
                "properties": {"id":i,"name":val, "name_en": val, "name_es": val}
            }
        })
    });

    vt.layers[0] = dropkey(vt.layers[0], {id:'dropkey', options: [{field:'name'}, {field: 'name_es'}]});
    var after = util.toGeoJSON(vt);
    assert.equal(after.features.length, 5, 'retains all features');

    after.features.forEach(function(feat) {
        assert.notOk(feat.properties.name, 'Ensure name has been dropped');
        assert.notOk(feat.properties.name_es, 'Ensure name_es has been dropped');
        console.log('NAME_EN', feat.properties.name_en);
        assert.ok(feat.properties.id+1, 'Enusure id is retained');
        assert.ok(feat.properties.name_en, 'Enusure name_en is retained');                                      
    });

    assert.end();
});
