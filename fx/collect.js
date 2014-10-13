module.exports = fx;
module.exports.parameters = {};

function fx(layer, options) {
    var field = options.field;
    var newfeatures = [], bucket = {};

    for (var i=0; i<layer.features.length; i++) {
        var feature = layer.features[i];
        var value = (field != null) ? getvalue(feature) : "feat";
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

    function getvalue(feature) {
        for (var i = 0; i<feature.tags.length; i+=2) {
            //console.log(layer.keys[i]);
            if (layer.keys[feature.tags[i]] !== field) {
                // drop keys + values eaten by groupby
                layer.keys.splice(feature.tags[i], 1);
                layer.values.splice(feature.tags[i+1], 1);
            } else {
                for (v in layer.values[feature.tags[i+1]]) {
                    var value = layer.values[feature.tags[i+1]][v];
                    if (value != 'null' ) {
                        return (typeof value === 'string') ? value.toLowerCase() : value;
                    };
                }
            }
        }
    }
}