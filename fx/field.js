module.exports = fx;

function fx(layer, options) {
    var field = options.field || null;
    var value = options.value || null;

    layer.features = layer.features.filter(function(feature){
        for (var ix = 0; ix < feature.tags.length; ix +=2 ){
            var featureKey = layer.keys[feature.tags[ix]];
            var featureValue = layer.values[feature.tags[ix+1]].string_value;
            if (featureKey === field && featureValue === value){
                return true;
            }
        }
    })
    return layer;
}