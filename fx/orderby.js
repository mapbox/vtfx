module.exports = fx;

function fx(layer, options) {
    var field = options.field;
    if (!field) throw new Error('field is not set');
    if (field && layer.keys.indexOf(field) === -1) throw new Error("field "+field+" does not exist");

    var sort = options.sort || 1; // 1 asc, -1 desc

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