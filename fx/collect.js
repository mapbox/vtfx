module.exports = fx;
module.exports.parameters = {};

function fx(layer, options) {
    var field = options.field;
    var newfeatures = [], bucket = {};

    for (var i=0; i<layer.features.length; i++) {
        var feature = layer.features[i];
        var arr = (field != null) ? getvalue(feature) : "";
        var value = (arr != "") ? arr[1] : "";
        switch (feature.type) {
            case 1:
                place(value+"_point");
                break;
            case 2:
                place(value+"_line");
                break;
            case 3:
                place(value+"_poly");
                break;
        }

        function place(pail) {
            if (!bucket[pail]) {
                console.log(pail);
                bucket[pail] = feature;
            } else {
                bucket[pail].geometry = bucket[pail].geometry.concat(feature.geometry);
            }
            bucket[pail].tags = (arr != "") ? [arr[0],feature.tags[arr[0]+1]] : [];
        }

        for (b in bucket) {
            newfeatures.push(bucket[b]);
        }
    }
    layer.features = newfeatures;
    return layer

    function getvalue(feature) {
        for (var i = 0; i<feature.tags.length; i+=2) {
            if (layer.keys[feature.tags[i]] == field) {
                for (v in layer.values[feature.tags[i+1]]) {
                    var value = layer.values[feature.tags[i+1]][v];
                    if (value != 'null' ) {
                        value = (typeof value === 'string') ? value.toLowerCase() : value;
                        return [i, value];
                    };
                }
            }
        }

    }
}