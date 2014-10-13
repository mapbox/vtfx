var fs = require('fs');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

var fn = {
    cleaner: require('../fx/cleaner_change_index'),
    cleaner_singlefeatloop: require('../fx/cleaner_singlefeatloop')
}

var fixtures = {
    drop10: getLayer(fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-drop10-poi_label.pbf'), 'poi_label'),
    drop100: getLayer(fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-drop100-poi_label.pbf'), 'poi_label'),
    drop200: getLayer(fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-drop200-poi_label.pbf'), 'poi_label'),
    drop1000: getLayer(fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-drop1000-poi_label.pbf'), 'poi_label'),
    labelgrid2048: getLayer(fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-labelgrid2048-poi_label.pbf'), 'poi_label'),
    labelgrid1024: getLayer(fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-labelgrid1024-poi_label.pbf'), 'poi_label'),
    labelgrid512: getLayer(fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-labelgrid512-poi_label.pbf'), 'poi_label'),
    labelgrid256: getLayer(fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-labelgrid256-poi_label.pbf'), 'poi_label'),
    linelabel: getLayer(fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-linelabel-poi_label.pbf'), 'road')
};

var data = {};

console.log('Benchmarks for garbage collector: ');

// add tests
for (var i in fn){
    for (var ix in fixtures){
        (function(i, ix){
            suite.add(i + '#' + ix, function(){
                fn[i](fixtures[ix]);
            })
        })(i, ix);
    }
}

// add listeners
suite.on('cycle', function(event) {
    var fn = event.target.name.split('#')[0];
    var test = event.target.name.split('#')[1],
        series = /\D+/.exec(test)[0];
    data[fn] = data[fn] || {};
    data[fn][series] = data[fn][series] || {};
    data[fn][series][parseInt(fixtures[test].features.length)] = event.target.hz;
    console.log(String(event.target) + ' for ' + fixtures[test].features.length + ' features ');
})
.on('complete', function(){
    console.log('Benchmark data:\n', data);
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
            var layer = tile.layers[i];
        }
    }
    return layer;
}