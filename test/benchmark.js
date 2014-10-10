var fs = require('fs');
var cleaner = require('../fx/cleaner_change_index');

var fixtures = {
	linelabel: getLayer(fs.readFileSync(__dirname + '/before-garbage-linelabel-poi_label.pbf'), 'road'),
	dropTen: getLayer(fs.readFileSync(__dirname + '/before-garbage.pbf'), 'poi_label'),
	dropHundred: getLayer(fs.readFileSync(__dirname + '/before-garbage-drop100-poi_label.pbf'), 'poi_label'),
	labelgrid: getLayer(fs.readFileSync(__dirname + '/before-garbage-labelgrid-poi_label.pbf'), 'poi_label')
}

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

// add tests
suite.add('cleaner#dropTen', function(){
	cleaner(fixtures.dropTen);
})
.add('cleaner#dropHundred', function(){
	cleaner(fixtures.dropHundred);
})
.add('cleaner#labelgrid', function(){
	cleaner(fixtures.labelgrid);
})
.add('cleaner#linelabel', function(){
	cleaner(fixtures.linelabel);
})
// add listeners
.on('cycle', function(event) {
	var test = event.target.name.split('#')[1];
  	console.log(fixtures[test].features.length + ' features: ' + String(event.target));
})
.run();


function encodePBF(pbf) {
    var protobuf = require('protocol-buffers');
    var path = require('path');

    // Gross!
    var proto = fs.readFileSync(path.dirname(require.resolve('mapnik-vector-tile')) + '/proto/vector_tile.proto', 'utf8');
    proto = proto.replace('package mapnik.vector;', '');
    proto = proto.replace('optional uint64 id = 1;', 'optional int64 id = 1;');
    proto = proto.replace('option optimize_for = LITE_RUNTIME;', '');
    proto = proto.replace('extensions 8 to max;', '');
    proto = proto.replace('extensions 16 to max;', '');
    proto = proto.replace('extensions 16 to 8191;', '');
    return mvt = protobuf(proto);
}

function getLayer(pbf, layerName) {
	var mvt = encodePBF(pbf);
	var tile = mvt.tile.decode(pbf);

	for (var i = 0; i < tile.layers.length; i++) {
	    var name = tile.layers[i].name;
	    if (name === layerName){
	    	var layer = tile.layers[i]
	    }
	}
	return layer;
}