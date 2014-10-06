module.exports = fx;
module.exports.parameters = {};

function fx(layer, options) {
    var field = options.field;
    var newfeatures = [], bucket = {};

    for (var i=0; i<layer.features.length; i++) {
        var feature = layer.features[i];
        var value = getvalue(feature);
        if (!bucket[value]) {
            bucket[value] = feature;
        } else {
            bucket[value].geometry = bucket[value].geometry.concat(feature.geometry);
        }
    }
    for (i in bucket) {
        newfeatures.push(bucket[i]);
    }
    layer.features = newfeatures;
    return layer

    function getvalue(x) {
        for (var i = 0; i<x.tags.length; i+=2) {
            if (layer.keys[x.tags[i]] === field) {
                for (v in layer.values[x.tags[i+1]]) {
                    var value = layer.values[x.tags[i+1]][v];
                    if (value != 'null' ) {
                        return (typeof value === 'string') ? value.toLowerCase() : value;
                    };
                }

            }
        }
    }
}