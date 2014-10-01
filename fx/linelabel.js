module.exports = fx;

function fx(layer, options) {
    var size = options.size || 10;
    count = 0;
    for (var i = 0; i<layer.features.length; i++) {
        var feature = layer.features[i];
        // only process lines with more than 1 point
        if (feature.type !== 2) {
            var geoms = [], part = [], arr = [], pos = 0 ;
            while (pos < feature.geometry.length) {
                part.push([feature.geometry[pos+1],feature.geometry[pos+2]]);
                repeat = (feature.geometry[pos+3]>>3);
                for (var d=pos+4; d<pos+4+(repeat*2); d++) {
                    arr.push(feature.geometry[d]);
                }
                console.log(arr.length / 2)
                for (var l=0; l<arr.length; l+=2) {
                    var x = part[part.length-1][0] + arr[l];
                    var y = part[part.length-1][1] + arr[l+1];
                    part.push([x,y]);
                }
                geoms.push(part);
                pos = pos+5+(repeat*2);
            }
        }
        count++;
    }
    return layer;
}