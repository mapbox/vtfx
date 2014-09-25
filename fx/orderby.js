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
        for (var i = 0; i<a.tags.length; i+=2) {
            if (layer.keys[a.tags[i]] === field) {
                var oa = layer.values[a.tags[i+1]].int_value;
            }
        }
        for (var i = 0; i<b.tags.length; i+=2) {
            if (layer.keys[b.tags[i]] === field) {
                var ob = layer.values[b.tags[i+1]].int_value;
            }
        }
        return (oa < ob) ? (-1*sort) : (1*sort);
    })
    return layer;

}