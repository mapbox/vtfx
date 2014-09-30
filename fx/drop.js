module.exports = fx;

function fx(layer, options) {
    var limit = options.limit || 50;
    if (isNaN(limit)) throw new Error('options.limit must be a number');

    if (layer.features.length > limit) {
        layer.features = layer.features.slice(0,limit);
    }
    return layer;
}

