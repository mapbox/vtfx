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
        var tags = layer.features[i].tags,
            featureLength = tags.length;
        for (var ix = 0; ix < featureLength; ix +=2){
            var exists = keys.indexOf(tags[ix]);
            if (exists >= 0 && keys.length > 0) {
                // approximation of a refcount
                kept.keys[keys[exists]] = true;
                // once a key is confirmed to exist, don't let it be checked for again
                keys.splice(exists, 1);
            }
            exists = values.indexOf(tags[ix+1]);
            if (exists >= 0 && values.length > 0) {
                // approximation of a refcount
                kept.values[values[exists]] = true;
                // once a value is confirmed to exist, don't let it be checked for again
                values.splice(exists, 1);
            }
        }
    }

    // set the values for each kept key to its new index
    keys = Object.keys(kept.keys);
    for (var i = 0; i < keys.length; i ++){
        kept.keys[keys[i]] = i;
    }
    // set the values for each kept value to its new index
    values = Object.keys(kept.values);
    for (var i = 0; i < values.length; i ++){
        kept.values[values[i]] = i;
    }

    for (var i in layer.features){
        tags = layer.features[i].tags;
        featureLength = tags.length;

        for (var ix = 0; ix < featureLength; ix +=2){
            var delta;
            // offset key values for removed items
            // delta is the difference between the current ix and the new one, as calculated above
            delta = tags[ix] - kept.keys[tags[ix]];
            tags[ix] = tags[ix] - delta;

            // offset value values for removed items
            delta = tags[ix + 1] - kept.values[tags[ix + 1]];
            tags[ix + 1] = tags[ix + 1] - delta;
        }
    }

    // remove keys and values that are no longer referenced
    for (var i = layer.keys.length - 1; i >= 0; i--){
        if (kept.keys[i] === undefined) layer.keys.splice(i, 1);
    }
    for (var i = layer.values.length - 1; i >= 0; i--){
        if (kept.values[i] === undefined) layer.values.splice(i, 1);
    }
    return layer;
}