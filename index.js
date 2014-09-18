var mapnik = require('mapnik');
var path = require('path');
mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins,'ogr.input'));

module.exports = vtfx;

// @TODO problems with using toGeoJSON:
// - expensive to stringify/parse for copying layers
// - is there a hardcoded buffer size in toGeoJSON ?
// - round-tripping coordiantes to wgs84 and back could be expensive/lossy
function vtfx(data, options, callback) {
    // The z,x,y coordinates here are a lie.
    var from = new mapnik.VectorTile(0,0,0);
    from.setData(data);
    from.parse();

    var layers = from.names();
    var to = new mapnik.VectorTile(0,0,0);
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        // If layer has a config, drop features from it.
        if (options[layer]) {
            var geojson = from.toGeoJSON(layer);
            geojson.features = geojson.features.slice(0,options[layer].limit || 50);
            to.addGeoJSON(JSON.stringify(geojson), layer, {tolerance:0});
        // Skip layers without config: just copy contents.
        } else {
            to.addGeoJSON(JSON.stringify(from.toGeoJSON(layer)), layer, {tolerance:0});
        }
    }

    callback(null, to.getData());
}

