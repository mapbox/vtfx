module.exports = fx;

function fx(layer, options) {
    var size = options.size || null;
    var order = options.order || '';
    if (!order && sort) {
        console.log(new Error('order by is not set'))
    } else {
        var sort = options.sort || 0; // 0 asc, 1 desc
    }
    // is this how errors work?
    if (262144 % size !== 0) {
        console.log(new Error(size+" does not divide evenly into 262144"));
    }

    if (order && layer.keys.indexOf(order) === -1) {
        console.log(new Error("field "+order+" does not exist"));
    }

    function snap(c) {
        return ((c%size) > size/2) ? c+(size - c%size) : c - c%size;
    }

    var grid = {}, newfeatures = [], ordervalue = 0;

    for (var i = 0; i<layer.features.length; i++) {
        if (layer.features[i].type !== 1 ) {
            console.log(new Error("non-point geometry"));
        }
        var feature = layer.features[i];
        var coord = snap(feature.geometry[1])+','+snap(feature.geometry[2]);
        if (!grid[coord]) { grid[coord] = {}; grid[coord].value = 0; }

        if (order) {
            for (var j = 0; j<feature.tags.length; j+=2) {
                if (layer.keys[feature.tags[j]] === order) {
                    var ordervalue = layer.values[feature.tags[j+1]].int_value;
                }
            }
        }
        if ([grid[coord].value, ordervalue].sort()[sort] === ordervalue) {
            grid[coord].value = ordervalue;
            grid[coord].feat = feature;
        }
    }
    for ( coord in grid ) {
        newfeatures.push(grid[coord].feat);
    }

    //console.log('old:\t', layer.features.length);
    layer.features = newfeatures;
    //console.log('new:\t', layer.features.length);

    return layer;
}

