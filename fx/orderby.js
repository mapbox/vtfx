module.exports = fx;

module.exports.parameters = {
    "name": "orderby",
    "display": "Order by feature",
    "description": "Returns sorted layer features based on which field to order by and sort direction.",
    "options": [
        {
            "field": "field",
            "type": "string"
        },
        {
            "field": "sort",
            "type": "number",
            "options": [{ "1": "asc"}, {"-1": "desc" }],
            "default": 1
        }
    ],
    "chainable": false
}

function fx(layer, options) {
    var field = options.field;
    if (!field) throw new Error('field is not set');
    if (field && layer.keys.indexOf(field) === -1) throw new Error("field "+field+" does not exist");

    var sort = options.sort || 1; // 1 asc, -1 desc

    layer.features = layer.features.sort(function(a, b) {
        var va = getvalue(a);
        var vb = getvalue(b);
        if (va === vb) return 0;
        return (va > vb) ? sort : -sort;
    });

    function getvalue(x) {
        for (var i = 0; i<x.tags.length; i+=2) {
            if (layer.keys[x.tags[i]] === field) {
                for (v in layer.values[x.tags[i+1]]) {
                    var value = layer.values[x.tags[i+1]][v];
                    if (value !== null ) {
                        return (typeof value === 'string') ? value.toLowerCase() : value;
                    };
                }

            }
        }
    }
    return layer;
}
