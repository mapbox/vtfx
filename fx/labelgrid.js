module.exports = fx;

function fx(layer, options) {
    var size = options.size || null;

    // is this how errors work?
    if (layer.extent % size !== 0) {
        console.log(new Error(size+" does not divide evenly into layer extent"));
    }
    function snap(c) {
        return ((c%size) > size/2) ? c+(size - c%size) : c-c%size;
    }

    var grid = {}, newfeatures = [];
    for (var i = 0; i<layer.features.length; i++) {
        var feature = layer.features[i];
        if (feature.type !== 1) {
            console.log(new Error("non-point geometry"));
        }
        var coord = snap(feature.geometry[1])+','+snap(feature.geometry[2]);
        // only place feature in coord/bucket if there's nothing already there
        // assumes features are already sorted by orderby processor
        if (!grid[coord]) { grid[coord] = feature; }
    }
    for (coord in grid) {
        newfeatures.push(grid[coord]);
    }

    layer.features = newfeatures;
    return layer;
}

