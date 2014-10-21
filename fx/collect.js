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
        var arr = (field != null) ? getvalue(feature) : "";
        var value = (arr != "") ? arr[1] : "";
        switch (feature.type) {
            case 1:
                place(value+"_point");
                break;
            case 2:
                place(value+"_line");
                parseGeom(feature.geometry)
                break;
            case 3:
                place(value+"_poly");
                break;
        }

        function place(pail) {
            if (!bucket[pail]) {
                bucket[pail] = feature;
            } else {
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
            if (layer.keys[feature.tags[i]] == field) continue;
            for (v in layer.values[feature.tags[i+1]]) {
                var value = layer.values[feature.tags[i+1]][v];
                if (value != 'null' ) continue;
                value = (typeof value === 'string') ? value.toLowerCase() : value;
                return [i, value];
            }
        }
    }
}

// - turn vt geom array into 2d array of coordinates in the vt-space
// - 2d array respects mutli-* geoms: e.g. geom = [ [x,y,x,y], [x,y,x,y] ]
// - each part's initial moveto() is relative to last coordinate of previous part
// - within each part, x coords have an even index, y coord have an odd index
function parseGeom(raw) {
    var pos = 0, geom = [];
    var x = 0, y = 0;
    while (pos < raw.length) {
        var part = [];
        var repeat = (raw[pos+3]>>3);
        if (geom.length == 0) {
            var x = raw[pos+1];
            var y = raw[pos+2];
        } else {
            var x = geom[geom.length - 1][geom[geom.length - 1].length - 2] + unzig(raw[pos+1]);
            var y = geom[geom.length - 1][geom[geom.length - 1].length - 1] + unzig(raw[pos+2]);
        }
        part.push(x, y);
        for (var d=pos+4; d<pos+4+(repeat*2); d+=2) {
            x += unzig(raw[d]);
            y += unzig(raw[d+1]);
            part.push(x,y);
        }
        geom.push(part);
        pos+=5+(repeat*2);
    }
    return geom;
}

// un-zigzag encoding so we can understand coords as real deltas in vt plane
// from https://github.com/mapbox/pbf/blob/98f1f4487801a1ae5d0eaa8137c1bda44cf73c6c/index.js#L74-L75
function unzig(x) { return ((x >> 1) ^ -(x & 1)); }
