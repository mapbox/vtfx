module.exports = fx;

function fx(layer, options) {
    var size = options.size || null;
    var order = options.order || '';
    if (!order && sort) {
        console.log(new Error('order by is not set'))
    } else {
        var sort = options.sort || 'asc';
    }
    // is this how errors work?
    if (262144 % size !== 0) {
        console.log(new Error(size+" does not divide evenly into 262144"));
    }

    if (layer.keys.indexOf(order) === -1) {
        console.log(new Error("field "+order+" does not exist"));
    }

    function snap(c) {
        return ((c%size)>size/2) ? c+(size-c%size) : c-(c%size);
    }

    var grid = {}, newfeatures = [];

    for (var i=0; i<layer.features.length; i++) {
        if (layer.features[i].type !== 1 ) {
            console.log(new Error("non-point geometry"));
        }
        var feature = layer.features[i];
        var coordname = snap(feature.geometry[1])+','+snap(feature.geometry[2]);
        if (!grid[coordname]) { grid[coordname] = []; }

        for (var j = 0; j<feature.tags.length; j+=2) {
            if (layer.keys[feature.tags[j]] == order) {
                // except what if `order` is not an int_value ?
                var orderValue = layer.values[feature.tags[j+1]].int_value;
            }
        }
        grid[coordname].push([orderValue, feature])
    }
    // get max `order` from grid
    // this will need to respect the sort order direction (asc vs desc)
    for (coord in grid) {
        // this is gross, should probably make grid[coord] an obj with 2 arrays
        var o = 0, max = 0;
        for (var b=0; b<grid[coord].length; b++) {
            if (max > grid[coord][b][0]) {
                max = grid[coord][b][0];
                o = b;
            }
        }
        newfeatures.push(grid[coord][o][1]);
    }

    //console.log('old:\t', layer.features.length);
    layer.features = newfeatures;
    //console.log('new:\t', layer.features.length);

    return layer;
}

