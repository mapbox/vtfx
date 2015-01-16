module.exports = dropinvalid;

module.exports.parameters = {
    "name": "dropinvalid",
    "display": "Drop invalid geometres",
    "description": "Checks lines and polygons for self intersection and if detected removes them",
    "options": [],
    "chainable": false
};

function dropinvalid(layer) {
    var newFeatures = [];
    l = layer.features.length;
    while (l--) {
        if (layer.features[l].type === 2 || layer.features[l].type === 3) {
            var geom = layer.features[l].geometry;
            var segs = [];
            var current = [unzig(geom[1]), unzig(geom[2])];
            for (var i = 4; i < geom.length - 1; i=i+2) {
                var line = [current, [current[0] - (unzig(geom[i])), current[1] - (unzig(geom[i+1]))]]
                current = line[1];
                segs.push(line);
            }
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

function inRange(a, b, x) { return (x-a)*(x-b)<0; }
function unzig(x) { return (x % 2 == 0) ? x / 2 : -1 * Math.floor(x / 2) -1; }
