module.exports = fx;

module.exports.parameters = {
	"name": "drop",
    "display": "Drop",
    "description": "Drop a specified number of features from data.",
    "options": [
        {
            "field": "limit",
            "type": "number"
        }
    ],
    "chainable": false
};

function fx(layer, options) {
    var limit = options.limit || 50;
    if (isNaN(limit)) throw new Error('options.limit must be a number');

    if (layer.features.length > limit) {
        layer.features = layer.features.slice(0,limit);
    }
    return layer;
}

