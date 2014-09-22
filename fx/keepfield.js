module.exports = fx;

function fx(layer, options) {
    var fields = options.fields || [];

    layer.features = layer.features.filter(function(feature){
        for (var ix = 0; ix < feature.tags.length; ix +=2 ){
            var featureKey = layer.keys[feature.tags[ix]];
            var featureValue = layer.values[feature.tags[ix+1]].string_value;
            for (var i in fields) {
                if (featureKey === fields[i].field && featureValue === fields[i].value){
                    return true;
                }
            }
        }
    });
    return layer;
}