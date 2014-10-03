module.exports = fx;

function fx(layer, options) {
    var field = options.labelfield;
    layer.features = layer.features.filter(function(feature){
        var line = 0;
        line = feature.type == 2 ? getlength(feature.geometry,line) : 0;
        for (var ix=0; ix<feature.tags.length; ix +=2) {
            if (layer.keys[feature.tags[ix]] == field) {
                var label = layer.values[feature.tags[ix]].string_value.length*10;
            }
        }
        return line > label;
    })
    return layer;
}

function getlength(geom, ll) {
    var pos = 0;
    while (pos < geom.length) {
        var partlength = 0;
        repeat = (geom[pos+3]>>3);
        for (var d=pos+4; d<pos+4+(repeat*2); d+=2) {
            var dx = geom[d];
            var dy = geom[d+1];
            partlength+=Math.sqrt(dx*dx + dy*dy);
        }
        // for multi* geoms, we only care about the longest part
        pos+=5+(repeat*2);
    }
    return partlength > ll ? partlength : ll;
}