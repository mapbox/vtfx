module.exports = dropinvalid;

function dropinvalid(layer) {
    var newFeatures = [];
    l = layer.features.length;
    while (l--) {
        if (layer.features[l].type === 2 || layer.features[l].type === 3) {
            var geom = layer.features[l].geometry;
            var segs = [];
            var orig = [geom[1]>>3, geom[2]>>3];
            segs.push([orig, [orig[0] + (geom[4]>>3), orig[1] + (geom[5]>>3)]]);
            var current = segs[0][1];
            var closer = 2;
            if (layer.features[l].type === 3) closer = 4; 
            for (var i = 5; i < geom.length - closer; i=i+2) {
                var line = [current, [current[0] + (geom[i]>>3), current[1] + (geom[i+1]>>3) ]]
                current = line[1];
                segs.push(line);
            }
            if (layer.features[l].type === 3) segs.push([current, orig]);
            validSegs = [segs[0]];
            var invalid = false;
            for (var i = 1; i < segs.length; i++) {
                if (!intersects(segs[i], validSegs)) validSegs.push(segs[i]);
                else {
                    invalid = true;
                    break;
                }
            }
            if (!invalid) newFeatures.push(layer.features[l]);
        } else newFeatures.push(layer.features[l]);
    }
    layer.features = newFeatures;
    return layer;
}

//Determines centre using a cramer linear system
function intersects (seg, validSegs) {
    var l = validSegs.length;
    s1 = [ -((seg[1][1] - seg[0][1])/(seg[1][0] - seg[0][0])), 1, seg[0][1] -(((seg[1][1] - seg[0][1])/(seg[1][0] - seg[0][0])) * seg[0][0])];
    while (l--) {
        s2 = [ -((validSegs[l][1][1] - validSegs[l][0][1])/(validSegs[l][1][0] - validSegs[l][0][0])), 1, validSegs[l][0][1] -(((validSegs[l][1][1] - validSegs[l][0][1])/(validSegs[l][1][0] - validSegs[l][0][0])) * validSegs[l][0][0])];
        detA = s1[0]*s2[1] - s2[0]*s1[1];
        detX = s1[2]*s2[1] - s2[2]*s1[1];
        detY = s1[0]*s2[2] - s2[0]*s1[2];
        if (inRange(seg[0][0], seg[1][0], parseFloat((detX/detA).toPrecision(12))) && 
            inRange(seg[0][1], seg[1][1], parseFloat((detY/detA).toPrecision(12))) &&
            inRange(validSegs[l][0][0], validSegs[l][1][0], parseFloat((detX/detA).toPrecision(12))) &&
            inRange(validSegs[l][0][1], validSegs[l][1][1], parseFloat((detY/detA).toPrecision(12))) ) {
            return true;
        }
    }
    return false;
}

function inRange(a, b, x) {
    return (x-a)*(x-b)<0;
}
