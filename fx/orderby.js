module.exports = fx;

function fx(layer, options) {
    var field = options.field;
    if (field && layer.keys.indexOf(field) === -1) {
        console.log(new Error("field "+field+" does not exist"));
    }
    if (!field && sort) {
        console.log(new Error('order by field is not set'))
    } else {
        var sort = options.sort || 1; // 1 asc, -1 desc
    }

    layer.features = layer.features.sort(function(a, b) {
        for (var f = 0; f<layer.features.length; f++) {
            var feature = layer.features[f];
            for (var i = 0; i<feature.tags.length; i+=2) {
                if (layer.keys[feature.tags[i]] === field) {
                    var oa = a.layer.values[feature.tags[i+1]].int_value,
                        ob = b.layer.values[feature.tags[i+1]].int_value;
                    return (oa < ob) ? (-1 * sort) : (1 * sort);
                }
            }
        }
    })
    return layer;

}