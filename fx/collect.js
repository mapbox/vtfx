module.exports = fx;
module.exports.parameters = {
    "name": "collect",
    "display": "Group features by attribue",
    "description": "Groups all features with the supplied field into one object. If no field is given features are grouped by geometery type",
    "options": [
        {
            "field": "field",
            "type": null
        }
    ],
    "chainable": false
};

function fx(layer, options) {
    var field = options.field;
    var newfeatures = [], bucket = {};

    for (var i=0; i<layer.features.length; i++) {
        var feature = layer.features[i];
        var arr = (field !== null) ? getvalue(feature) : "";
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
                bucket[pail] = feature;
            } else {
                var last = last || [0,0];
                last = getLastCoord(bucket[pail].geometry, last);
                feature.geometry[1] = rezig(last[0] - unzig(feature.geometry[1]));
                feature.geometry[2] = rezig(last[1] - unzig(feature.geometry[2]));
                bucket[pail].geometry = bucket[pail].geometry.concat(feature.geometry);
            }
            bucket[pail].tags = (arr != "") ? [arr[0],feature.tags[arr[0]+1]] : [];
        }
    }
    for (b in bucket) {
        newfeatures.push(bucket[b]);
    }
    layer.features = newfeatures;
    return layer

    function getvalue(feature) {
        for (var i = 0; i<feature.tags.length; i+=2) {
            // from https://github.com/mapbox/vtfx/commit/06ded25d42e9ba7beb704df2eb8741f403a6b9f4#commitcomment-8178397
            if (layer.keys[feature.tags[i]] == field) continue;
            var v = layer.values[feature.tags[i+1]];
            var value = v.string_value !== null ? v.string_value.toLowerCase() : v.string_value ||
                v.int_value !== null ? v.int_value : v.int_value ||
                v.float_value !== null ? v.float_value : v.float_value ||
                v.double_value !== null ? v.double_value : v.double_value ||
                v.uint_value !== null ? v.uint_value : v.uint_value ||
                v.sint_value !== null ? v.sint_value : v.sint_value ||
                v.bool_value !== null ? v.bool_value : values.bool_value || null;
        }
        return [i, value];
    }
}

// TODO: supply old [last] array
// so we dont start from zero / the beginning of the geom array everytime
function getLastCoord(geom, last) {
    var pos = 0;
    var x = last[0];
    var y = last[1];
    while (pos < geom.length) {
        var repeat = (geom[pos+3]>>3);
        x += unzig(geom[pos+1]);
        y += unzig(geom[pos+2]);
        for (var d=pos+4; d<pos+4+(repeat*2); d+=2) {
            x += unzig(geom[d]);
            y += unzig(geom[d+1]);
        }
        pos+=5+(repeat*2);
    }
    return [x,y];
}

// un-zigzag encoding so we can understand coords as real deltas in vt plane
// from https://github.com/mapbox/pbf/blob/98f1f4487801a1ae5d0eaa8137c1bda44cf73c6c/index.js#L74-L75
function unzig(x) { return ((x >> 1) ^ -(x & 1)); }

// re-zigzag encode coordinates so its like we decoded anything
function rezig(x) { return (x << 1) ^ ( x >> 31); }
