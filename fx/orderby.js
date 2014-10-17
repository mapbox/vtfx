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
    var fieldidx = layer.keys.indexOf(field);
    if (fieldidx === -1) throw new Error("field "+field+" does not exist");

    var sort = options.sort || 1; // 1 asc, -1 desc

    layer.features = layer.features.sort(function(a, b) {
        return (getvalue(a) < getvalue(b)) ? -sort : sort;
    });

    function getvalue(x) {
        for (var i = 0; i<x.tags.length; i+=2) {
            if (x.tags[i] !== fieldidx) continue;
            var values = layer.values[x.tags[i+1]];
            return values.string_value !== null ? values.string_value.toLowerCase() : values.string_value ||
                values.int_value !== null ? values.int_value : values.int_value ||
                values.float_value !== null ? values.float_value : values.float_value ||
                values.double_value !== null ? values.double_value : values.double_value ||
                values.uint_value !== null ? values.uint_value : values.uint_value ||
                values.sint_value !== null ? values.sint_value : values.sint_value ||
                values.bool_value !== null ? values.bool_value : values.bool_value || null;
        }
    }
    return layer;
}
