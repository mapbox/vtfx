module.exports = fx;

module.exports.parameters = {
    "name": "linelabel",
    "display": "Only keep line geometries long enough display labels",
    "description": "Check line length against the value of a given field, dropping all geometries too short to be labeled.",
    "options": [
        {
            "field": "field",
            "type": "string"
        }
    ],
    "chainable": false
};

function fx(layer, options) {
    var field = options.labelfield;
    layer.features = layer.features.filter(function(feature){
        var line = feature.type == 2 ? getlength(feature.geometry) : 0;
        for (var ix=0; ix<feature.tags.length; ix +=2) {
            if (layer.keys[feature.tags[ix]] == field) {
                var label = layer.values[feature.tags[ix]].string_value.length*10;
            }
        }
        return line > label;
    })
    return layer;
}

function getlength(geom) {
    var pos = 0, line = 0;
    while (pos < geom.length) {
        var part = 0;
        repeat = (geom[pos+3]>>3);
        for (var d=pos+4; d<pos+4+(repeat*2); d+=2) {
            var dx = geom[d];
            var dy = geom[d+1];
            part+=Math.sqrt(dx*dx + dy*dy);
        }
        // for multi* geoms, we only care about the longest part
        line = part > line ? part : line;
        pos+=5+(repeat*2);
    }
    return line;
}