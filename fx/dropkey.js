cleaner = require('./cleaner');

module.exports = dropkey;

// This function removes a given key and its corresponding value from the tile
module.exports.parameters = {
    "name": "dropkey",
    "display": "Drop the given key",
    "description": "Drop the given key and its corresponding value from the tile",
    "options": [ { "field": "field", "type": "string" } ], "chainable": true };

function dropkey(layer, options) {
    if (!options.options) throw new Error('Field options not provided');
    if (options.options.length > 0 && options.options[0] && !options.options[0].field) throw new Error('field must be given option required');
    var keyNames = options.options.map(function (field) { return field.field; });
    var keyIds = [];
    var l = layer.keys.length;
    while (l--) if (keyNames.indexOf(layer.keys[l]) !== -1) keyIds.push(l);
    var featId = layer.features.length;
    while (featId--) {
        var tagId = layer.features[featId].tags.length / 2;
        while (tagId--) {
            if (keyIds.indexOf(layer.features[featId].tags[tagId * 2]) !== -1)
                layer.features[featId].tags.splice(tagId * 2, 2);
        }
    }
    return cleaner(layer);
}
