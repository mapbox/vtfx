module.exports = fx;

function fx(layer, options) {
    var size = options.size || null;
    var order = options.order || null;
    var grid = {}, newfeatures = [];

    // 262144
    if (262144 % size !== 0) {
        console.log(size, "does not divide evenly into 262144");
    }

    console.log('old:\t', layer.features.length);

    // to bucket feature coordinates into nearest-grid-coord buckets,
    // find the nearest multiple of `size` param
    function snap(c) {
        if ( (c % size) > size/2 ) {
            // return next largest multiple of `size`
            return c + ( size - c%size);
        } else {
            // return next smallest multiple of `size`
            return c - (c%size);
        }
    }

    for (var i=0; i < layer.features.length; i++) {
        var x = layer.features[i].geometry[1], y = layer.features[i].geometry[2];
        var coordname = snap(x)+','+snap(y);
        // only create gridbucket arr if any feature points live at that gridbucket
        grid[coordname] = [];
        // push layer feature to bucket
        grid[coordname].push(layer.features[i]);
    }
    // populate new feature array with only first obj in each grid bucket
    for ( coord in grid ) {
        newfeatures.push(grid[coord][0]);
    }

    layer.features = newfeatures;
    console.log('new:\t', layer.features.length);
    return layer;
}

