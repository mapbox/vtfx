var tape = require('tape');
var util = require('./util.js');
var vtfx = require('../index.js').processors;

var vt = util.fromGeoJSON({
    "type": "FeatureCollection",
    "features": ['oak', 'maple', 'birch', 'teak', 'aspen', 'beech', 'dogwood', 'chestnut', 'sycamore', 'ash'].map(function(val,i) {
        return {
            "type": "Feature",
            "geometry": {"type": "Point","coordinates": [0,10]},
            "properties": {"id":i,"name":val}
        }
    })
});

tape('vtfx parameters', function(assert){
    for (var i in vtfx){
        console.log('## ' + i);
        var parameters = vtfx[i].parameters
        assert.ok(parameters.name, 'name field exists');
        assert.ok(parameters.display, 'display field exists');
        assert.ok(parameters.description, 'description field exists');
        
        var options = {};
        options.id = parameters.name;
        if (parameters.chainable) options.options = [];

        for (var ix in parameters.options){
            var value;
            var opts = parameters.options[ix];
            if (opts.default) value = opts.default;
            else if (opts.field === 'field') value = 'id';
            else if (opts.options) value = Object.keys(opts.params[0])[0];
            else if (opts.type === 'number') value = 100;
            else if (opts.type === 'boolean') value = true;
            else if (opts.type === 'string') value = 'id';
            
            if (parameters.chainable) {
                var params = {};
                params[opts.field] = value;
                options.options.push(params);
            } else {
                options[opts.field] = value;
            }
        }
        // If the parameters are wrong, this will error.
        // Specialized values should have a default.
        assert.ok(vtfx[i](vt.layers[0], options), 'apply parameters without error')
    }
    assert.end();
});
