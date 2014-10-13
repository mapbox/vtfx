module.exports = cleaner;

// This garbage collector removes nonreferenced features from layer.keys and layer.values and
// reindexes layer.keys and layer.values.
// The delta between the previous index and current is calculated and
// references in layer.features to keys and values are updated.

// Deletion from layer.keys and layer.values is done in place-ish,
// but there's still a lot of iteration and extra objects created.
function cleaner(layer){
    var keys = {};
    var keysIx = Object.keys(layer.keys);
    for (var i = 0; i < keysIx.length; i ++){
        keys[i] = keysIx[i];
    }
    var values = {};
    var valuesIx = Object.keys(layer.values);
    for (var i = 0; i < valuesIx.length; i ++){
        values[i] = valuesIx[i];
    }

    keysIx = [];
    valuesIx = [];

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
        if (keys === {} && values === {}) continue;
        for (var ix = 0; ix < featureLength; ix +=2){
            if (keys[tags[ix]]) {
                // approximation of a refcount
                kept.keys[keys[tags[ix]]] = counters.keys;
                counters.keys += 1;
                keysIx.push(keys[tags[ix]]);
                // once a key is confirmed to exist, don't let it be checked for again
                delete keys[tags[ix]];
            }
            if (values[tags[ix+1]]) {
                // approximation of a refcount
                kept.values[values[tags[ix+1]]] = counters.values;
                counters.values += 1;
                valuesIx.push(values[tags[ix+1]]);
                // once a value is confirmed to exist, don't let it be checked for again
                delete values[tags[ix+1]];

            }
            tags[ix] = kept.keys[tags[ix]]
            tags[ix+1] = kept.values[tags[ix+1]]
        }
    }

    // set the values for each kept key to its new index
    finalKeys = [];
    for (var i = 0; i < keysIx.length; i ++){
        finalKeys.push(layer.keys[keysIx[i]]);
    }
    // set the values for each value key to its new index
    finalValues = [];
    for (var i = 0; i < valuesIx.length; i ++){
        finalValues.push(layer.values[valuesIx[i]]);
    }

    layer.keys = finalKeys;
    layer.values = finalValues;

    return layer;
}