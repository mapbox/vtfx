cleaner = require('./cleaner');

module.exports = dropkey;

// This function removes a given key and its corresponding value from the tile
module.exports.parameters = {
    "name": "dropkey",
    "display": "Drop the given key",
    "description": "Drop the given key and its corresponding value from the tile",
    "options": [ { "field": "dropkey", "type": "string" } ], "chainable": false };

function dropkey(layer, options) {
    var keyId = layer.keys.length
    while (keyId--)
        if (layer.keys[keyId] === options.dropkey) break;  

    var featId = layer.features.length;
    while (featId--) {
        var tagId = layer.features[featId].tags.length / 2;
        while (tagId--)
            if (layer.features[featId].tags[tagId] === keyId) break;
        if (tagId) layer.features[featId].tags.splice(tagId, 2);
    }
    
    return cleaner(layer);
}
