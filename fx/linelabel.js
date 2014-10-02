module.exports = fx;

function fx(layer, options) {
    var size = options.size || 10;
    var count = 0;
    for (var i = 0; i<layer.features.length; i++) {
        count++;
        var feature = layer.features[i];
        var geoms = [];
        // only process lines with more than 1 point
        if (feature.type == 2) {
            var part = [], arr = [], pos = 0 ;
            while (pos < feature.geometry.length) {
                part.push([feature.geometry[pos+1],feature.geometry[pos+2]]);
                repeat = (feature.geometry[pos+3]>>3);
                for (var d=pos+4; d<pos+4+(repeat*2); d++) {
                    arr.push(feature.geometry[d]);
                }
                for (var l=0; l<arr.length; l+=2) {
                    var x = part[part.length-1][0] + arr[l];
                    var y = part[part.length-1][1] + arr[l+1];
                    part.push([x,y]);
                }
                geoms.push(part);
                pos = pos+5+(repeat*2);
            }
        }
        var linelength = 0;
        for (var p=0; p<geoms.length; p++) {
            for (var g=0; g<geoms[p].length; g+=2) {
                if (geoms[p][g] && geoms[p][g+1]) {
                    linelength+= getlength(geoms[p][g], geoms[p][g+1]);
                }
            }
        }
        console.log(count, linelength);
    }
    return layer;
}

function getlength(p1, p2) {
    dx = p2[0] - p1[0];
    dy = p2[1] - p1[1];
    return Math.sqrt(dx*dx + dy*dy);
}