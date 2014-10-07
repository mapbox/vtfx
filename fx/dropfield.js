var filter = require('feature-filter');

module.exports = fx;

function fx(layer, options) {
    var fields = options.fields || [];

    var filters = [];
    for (var f in fields){
        filters.push(filter(fields[f]));
    }
    layer.features = layer.features.filter(function(feature){
        var properties = {};
        for (var ix = 0; ix < feature.tags.length; ix +=2 ){
            properties[layer.keys[feature.tags[ix]]] = layer.values[feature.tags[ix+1]].string_value;
        }
        feature.properties = properties;
        for (var i in filters) {
            return !filters[i](feature);
        }
    });
    return layer;
}