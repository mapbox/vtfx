module.exports = cleaner;

// This garbage collector removes nonreferenced features from layer.keys and layer.values and
// reindexes layer.keys and layer.values.
// The delta between the previous index and current is calculated and
// references in layer.features to keys and values are updated.

// Deletion from layer.keys and layer.values is done in place-ish,
// but there's still a lot of iteration and extra objects created.
function cleaner(layer){
    var keys = Object.keys(layer.keys).map(Number);
    var values = Object.keys(layer.values).map(Number);
    var kept = {
        keys: {},
        values: {}
    };
    for (var i in layer.features){
        var featureLength = layer.features[i].tags.length;
        for (var ix = 0; ix < featureLength; ix +=2){
            var exists = keys.indexOf(layer.features[i].tags[ix]);
            if (exists >= 0 && keys.length > 0) {
                // once a key is confirmed to exist, don't let it be checked for again
                kept.keys[keys[exists]] = true;
                keys.splice(exists, 1);
            }
            exists = values.indexOf(layer.features[i].tags[ix+1]);
            if (exists >= 0 && values.length > 0) {
                // once a value is confirmed to exist, don't let it be checked for again
                kept.values[values[exists]] = true;
                values.splice(exists, 1);
            }
        }
    }
    keys = Object.keys(kept.keys);
    for (var i = 0; i < keys.length; i ++){
        kept.keys[keys[i]] = i;
    }
    values = Object.keys(kept.values);
    for (var i = 0; i < values.length; i ++){
        kept.values[values[i]] = i;
    }

    for (var i in layer.features){
        featureLength = layer.features[i].tags.length;
        for (var ix = 0; ix < featureLength; ix +=2){
            var delta;
            // offset key values for removed items
            delta = layer.features[i].tags[ix] - kept.keys[layer.features[i].tags[ix]];
            layer.features[i].tags[ix] = layer.features[i].tags[ix] - delta;

            // offset value values for removed items
            delta = layer.features[i].tags[ix + 1] - kept.values[layer.features[i].tags[ix + 1]];
            layer.features[i].tags[ix + 1] = layer.features[i].tags[ix + 1] - delta;
        }
    }

    for (var i = layer.keys.length - 1; i >= 0; i--){
        if (kept.keys[i] === undefined) layer.keys.splice(i, 1);
    }

    for (var i = layer.values.length - 1; i >= 0; i--){
        if (kept.values[i] === undefined) layer.values.splice(i, 1);
    }

    return layer;
}