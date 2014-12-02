var mapnik = require('mapnik');
var fs = require('fs');
var vtfx = require('../index.js');

function decodeLoadImage(zxy, filepath, format, callback) {
    try {
        var vtile = new mapnik.VectorTile(zxy.z, zxy.x, zxy.y);

        var iBuffer = fs.readFileSync(filepath);

        // Add the image data to a vector tile
        vtile.addImage(iBuffer, 'raster');

        // Write the vector tile to disk
        fs.writeFileSync('rasterbuffer-' + format + '.vector.pbf', vtile.getData());

        // Try decoding the image with vtfx
        var decoded = vtfx.decode(vtile.getData());

        // Take the image data that was decoded with vtfx, and load it into mapnik
        // This will fail if not an 8-bit RGB image
        var image = mapnik.Image.fromBytesSync(decoded.layers[0].features[0].raster);

        // Try getting a pixel
        return callback(null, image.getPixel(100,100), format);
    } catch(err) {
        return callback(err, null, format);
    }
}

var zxy = {
    z: 16,
    x: 10642,
    y: 24989
};

// UINT8 RGB
// ---------

decodeLoadImage(zxy, '24989.png', 'png_uint8_3band', function(err, pData, dType) {
    if (err) {
        console.log(dType + ' failed: ' + err.message);
    } else {
        console.log(dType + ' worked - pixel query: ' + JSON.stringify(pData));
    }
});

// UINT8 Tiff Single Band
// ---------

decodeLoadImage(zxy, '24989_rgb_uint8.tif', 'tif_uint8_3band', function(err, pData, dType) {
    if (err) {
        console.log(dType + ' failed: ' + err.message);
    } else {
        console.log(dType + ' worked - pixel query: ' + JSON.stringify(pData));
    }
});

// UINT8 Tiff Single Band
// ---------

decodeLoadImage(zxy, '24989_ndvi_uint8.tif', 'tif_uint8_1band', function(err, pData, dType) {
    if (err) {
        console.log(dType + ' failed: ' + err.message);
    } else {
        console.log(dType + ' worked - pixel query: ' + JSON.stringify(pData));
    }
});

// UINT16 Tiff Single Band
// ---------

decodeLoadImage(zxy, '24989_ndvi_uint16.tif', 'tif_uint16_1band', function(err, pData, dType) {
    if (err) {
        console.log(dType + ' failed: ' + err.message);
    } else {
        console.log(dType + ' worked - pixel query: ' + JSON.stringify(pData));
    }
});

// Float32 Tiff single band
// -------------------

decodeLoadImage(zxy, '24989_ndvi.tif', 'tif_float32_1band', function(err, pData, dType) {
    if (err) {
        console.log(dType + ' failed: ' + err.message);
    } else {
        console.log(dType + ' worked - pixel query: ' + JSON.stringify(pData));
    }
});