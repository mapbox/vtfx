module.exports = fx;

function fx(layer, options) {
    var limit = options.limit || 50;
    if (layer.features.length > limit) {
        layer.features = layer.features.slice(0,limit);
    }
    return layer;
}

