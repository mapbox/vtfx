module.exports = fx;

function fx(layer, options) {
    var field = options.field;
    if (field && layer.keys.indexOf(field) === -1) {
        console.log(new Error("field "+field+" does not exist"));
    }
    if (!field && sort) {
        console.log(new Error('order by field is not set'));
    } else {
        var sort = options.sort || 1; // 1 asc, -1 desc
    }

    layer.features = layer.features.sort(function(a, b) {
        return (getvalue(a) < getvalue(b)) ? -sort : sort;
    });
    function getvalue(x) {
        for (var i = 0; i<x.tags.length; i+=2) {
            if (layer.keys[x.tags[i]] === field) {
                return layer.values[x.tags[i+1]].int_value;
            }
        }
    }
    return layer;

}