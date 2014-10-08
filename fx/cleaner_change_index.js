// This garbage collector removes nonreferenced features from layer.keys and layer.values and
// reindexes layer.keys and layer.values.
// The delta between the previous index and current is calculated and
// references in layer.features to keys and values are updated.

// Deletion from layer.keys and layer.values is done in place-ish,
// but there's still a lot of iteration and extra objects created.
function cleaner(layer){
    var keys = Object.keys(layer.keys).map(Number);
    var values = Object.keys(layer.values).map(Number);

    var keptKeys = {};
    var keptValues = {};

    for (var i in layer.features){
        for (var ix = 0; ix < layer.features[i].tags.length; ix +=2){
            var exists = keys.indexOf(layer.features[i].tags[ix]);            
            if (exists >= 0) {
                keptKeys[keys[exists]] = true;
            }
            exists = values.indexOf(layer.features[i].tags[ix+1]);
            if (exists >= 0) {
                keptValues[values[exists]] = true;
            }
        }
    }

    keys = Object.keys(keptKeys).map(Number);
    values = Object.keys(keptValues).map(Number);

    for (var i in layer.features){
        for (var ix = 0; ix < layer.features[i].tags.length; ix +=2){
            // offset key values for removed items
            var delta = keys.indexOf(layer.features[i].tags[ix]);
            delta = keys[delta] - delta;
            layer.features[i].tags[ix] = layer.features[i].tags[ix] - delta;
            
            // offset value values for removed items
            delta = values.indexOf(layer.features[i].tags[ix + 1]);
            delta = values[delta] - delta;
            layer.features[i].tags[ix + 1] = layer.features[i].tags[ix + 1] - delta;
        }
    }

    for (var i = layer.keys.length - 1; i >= 0; i--){
        if (keptKeys[i] === undefined) layer.keys.splice(i, 1);
    }

    for (var i = layer.values.length - 1; i >= 0; i--){
        if (keptValues[i] === undefined) layer.values.splice(i, 1);
    }

    return layer;
};