module.exports = fx;

function fx(layer, options) {
    var field = options.labelfield;

    layer.features = layer.features.filter(function(feature){
        var linelength = 0, pos = 0;
        // how to only process lines?
        //if (feature.type == 2) continue;
        while (pos < feature.geometry.length) {
            var partlength = 0;
            repeat = (feature.geometry[pos+3]>>3);
            for (var d=pos+4; d<pos+4+(repeat*2); d+=2) {
                var dx = feature.geometry[d];
                var dy = feature.geometry[d+1];
                partlength+=Math.sqrt(dx*dx + dy*dy);
            }
            // for multi* geoms, we only care about the longest part
            if ( partlength > linelength ) {
                linelength = partlength;
            }
            pos = pos+5+(repeat*2);
        }
        for (var ix=0; ix<feature.tags.length; ix +=2) {
            if (layer.keys[feature.tags[ix]] == field) {
                var labellength = layer.values[feature.tags[ix]].string_value.length*10;
            }
        }

        if (labellength > linelength) return true;
    })
    return layer;
}