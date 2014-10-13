module.exports = fx;
module.exports.parameters = {};

function fx(layer, options) {
    var field = options.field;
    var newfeatures = [], bucket = {};

    for (var i=0; i<layer.features.length; i++) {

        var feature = layer.features[i];
        var value = (field != null) ? getvalue(feature) : [0, "feat"];
        if (!bucket[value[1]]) {
            bucket[value[1]] = feature;
        } else {
            bucket[value[1]].geometry = bucket[value[1]].geometry.concat(feature.geometry);
        }
        bucket[value[1]].tags = [value[0], feature.tags[value[0]+1]];
    }
    for (i in bucket) {
        newfeatures.push(bucket[i]);
    }
    layer.features = newfeatures;
    return layer

    function getvalue(feature) {
        for (var i = 0; i<feature.tags.length; i+=2) {
            if (layer.keys[feature.tags[i]] == field) {
                for (v in layer.values[feature.tags[i+1]]) {
                    var value = layer.values[feature.tags[i+1]][v];
                    if (value != 'null' ) {
                        value = (typeof value === 'string') ? value.toLowerCase() : value;
                        return [i, value];
                    };
                }
            }
        }

    }
}