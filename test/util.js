var path = require('path');
var mapnik = require('mapnik');
var vtfx = require('../index.js');
mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins,'ogr.input'));

module.exports = {};
module.exports.toGeoJSON = toGeoJSON;
module.exports.fromGeoJSON = fromGeoJSON;

// Create a single layer VT from a GeoJSON object and decode it.
function fromGeoJSON(json) {
    var vt = new mapnik.VectorTile(0,0,0);
    vt.addGeoJSON(JSON.stringify(json),'layer');
    return vtfx.decode(vt.getData());
}

// Return GeoJSON from a single layer decoded VT.
function toGeoJSON(decoded) {
    var vt = new mapnik.VectorTile(0,0,0);
    vt.setData(vtfx.encode(decoded));
    vt.parse();
    return vt.toGeoJSON('layer');
}

