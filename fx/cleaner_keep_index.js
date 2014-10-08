// This garbage collector doesn't renumber the tags in the feature layer.
// Placeholders remain in the layer.keys and layer.values arrays so maintain
// the index reference to the layer.features[i].tags.
function cleaner(layer){
    var keys = Object.keys(layer.keys).map(Number);
    var values = Object.keys(layer.values).map(Number);
    for (var i in layer.features){
        for (var ix = 0; ix < layer.features[i].tags.length; ix +=2){
            var exists = keys.indexOf(layer.features[i].tags[ix]);
            if (exists >= 0) delete keys[exists];
            exists = values.indexOf(layer.features[i].tags[ix+1]);
            if (exists >= 0) delete values[exists];
        }
    }

    for (var i in keys){
        // since the tags reference the index of the keys/values,
        // we can't delete the item, but only clear it 
        if (keys[i]) layer.keys[i] = null;
    }

    for (var i in values){
        // since the tags reference the index of the keys/values,
        // we can't delete the item, but only clear it 
        if (values[i]) layer.values[i] = null;
    }
    return layer;
};