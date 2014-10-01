module.exports = fx;

function fx(layer, options) {
    var size = options.size || 10;
    count = 0;
    for (var i = 0; i<layer.features.length; i++) {
        var feature = layer.features[i];
        // only process lines with more than 1 point
        if (feature.type !== 2 && feature.geometry.length > 3) {
            var geoms = [], pos = 3 ;
            //get first moveto()
            geoms.push([feature.geometry[1], feature.geometry[2]]);
            var repeat = (feature.geometry[pos]>>3);
            //now get all the lineto(), for all multipart parts
            // TODO: make this work
            while (pos < feature.geometry.length) {
                console.log(feature.geometry[pos],repeat,pos);
                var part = [];
                for (var d=4; d<pos; d++) {
                    part.push(feature.geometry[d]);
                }
                for (var l=0; l<part.length; l+=2) {
                    var x = geoms[geoms.length-1][0] + part[l];
                    var y = geoms[geoms.length-1][1] + part[l+1];
                    geoms.push([x,y]);
                }
                pos = 7+(repeat*2);
                repeat = (feature.geometry[pos]>>3);

            }
            console.log(geoms);
        }
        count++;
    }
    return layer;
}