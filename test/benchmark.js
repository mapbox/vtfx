var fs = require('fs');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

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
var mvt = protobuf(proto);

var functions = [
  { name: 'cleaner', fn: require('../fx/cleaner') },
  { name: 'cleaner2', fn: require('../fx/cleaner2') }
];

var fixtures = [
  { name: 'drop10', file: fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-drop10-poi_label.pbf'), layer: 'poi_label'},
  { name: 'drop100', file: fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-drop100-poi_label.pbf'), layer: 'poi_label'},
  { name: 'drop200', file: fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-drop200-poi_label.pbf'), layer: 'poi_label'},
  { name: 'drop1000', file: fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-drop1000-poi_label.pbf'), layer: 'poi_label'},
  { name: 'labelgrid2048', file: fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-labelgrid2048-poi_label.pbf'), layer: 'poi_label'},
  { name: 'labelgrid1024', file: fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-labelgrid1024-poi_label.pbf'), layer: 'poi_label'},
  { name: 'labelgrid512', file: fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-labelgrid512-poi_label.pbf'), layer: 'poi_label'},
  { name: 'labelgrid256', file: fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-labelgrid256-poi_label.pbf'), layer: 'poi_label'},
  { name: 'linelabel', file: fs.readFileSync(__dirname + '/garbagecollector-fixtures/before-garbage-linelabel-poi_label.pbf'), layer: 'road'}
];

console.log('Benchmarks for garbage collector: ');

// add tests
functions.forEach(function(fn) {
  fixtures.forEach(function(fixture) {
    suite.add({
      name: fixture.name + '#' + fn.name,
      fn: function() {
        this.fx(JSON.parse(layer));
      },
      setup: function() {
        var layer = JSON.stringify(this.getLayer(this.fixture));
      },
      fixture: fixture,
      getLayer: getLayer,
      fx: fn.fn
    });
  });
});

var counter = 0;
// add listeners
suite.on('cycle', function(event) {
  var length = getLayer(fixtures[counter]).features.length;
  counter += 1;
  console.log(String(event.target), event.target.hz.toFixed(2), 'for', length, 'features');
})
.on('complete', function(){
  console.log('Benchmark data:\n', data);
})
.run();

function getLayer(options) {
  var pbf = options.file,
  layerName = options.layer,
  tile = mvt.tile.decode(pbf);

  for (var i = 0; i < tile.layers.length; i++) {
    var name = tile.layers[i].name;
    if (name === layerName) {
      return tile.layers[i];
    }
  }
}
