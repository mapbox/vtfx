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
    var counters = {
        keys: 0,
        values: 0
    };
    for (var i in layer.features){
        var tags = layer.features[i].tags,
            featureLength = tags.length;
        if (keys.length === 0 && values.length === 0) continue;
        for (var ix = 0; ix < featureLength; ix +=2){
            var exists = keys.indexOf(tags[ix]);
            if (exists >= 0 && keys.length > 0) {
                // approximation of a refcount
                kept.keys[keys[exists]] = counters.keys;
                counters.keys += 1;
                // once a key is confirmed to exist, don't let it be checked for again
                keys.splice(exists, 1);
            }
            exists = values.indexOf(tags[ix+1]);
            if (exists >= 0 && values.length > 0) {
                // approximation of a refcount
                kept.values[values[exists]] = counters.values;
                counters.values += 1;
                // once a value is confirmed to exist, don't let it be checked for again
                values.splice(exists, 1);
            }
            tags[ix+1] = kept.values[tags[ix+1]]
        }
    }

    // set the values for each kept key to its new index
    keys = Object.keys(kept.keys).map(Number);
    finalKeys = [];
    for (var i = 0; i < keys.length; i ++){
        finalKeys.push(layer.keys[keys[i]]);
    }
    layer.keys = finalKeys;
    
    values = Object.keys(kept.values).map(Number);
    finalValues = [];
    for (var i = 0; i < values.length; i ++){
        finalValues.push(layer.values[values[i]]);
    }
    layer.values = finalValues;
    return layer;
}