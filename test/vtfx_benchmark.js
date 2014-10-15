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
  { name: 'drop100', fn: require('./../fx/drop'), options: { limit:100 }, layer: 'poi_label'},
  { name: 'labelgrid1024', fn: require('./../fx/labelgrid'), options: { size:1024 }, layer: 'poi_label'},
  { name: 'labelgrid256', fn: require('./../fx/labelgrid'), options: { size:256 }, layer: 'poi_label'},
  { name: 'orderby-scalerank', fn: require('./../fx/orderby'), options: { field:'scalerank' }, layer: 'poi_label'},
  { name: 'linelabel-class', fn: require('./../fx/linelabel'), options:  { labelfield:'class' }, layer: 'poi_label'}
];

var fixture = fs.readFileSync(__dirname + '/before.pbf');

console.log('Benchmarks for VTFX (this may take a few minutes): ');

// add tests
functions.forEach(function(fn) {
  suite.add({
      name: 'vtfx#' + fn.name,
      fn: function() {
        this.fx.fn(JSON.parse(layer), this.fx.options);
      },
      setup: function() {
        var layer = JSON.stringify(this.getLayer(this.fixture, this.fx.layer));
      },
      fixture: fixture,
      fx: fn,
      getLayer: getLayer
    });
});

// add listeners
suite.on('cycle', function(event) {
  console.log(String(event.target), event.target.hz);
})
.run();

function getLayer(pbf, layerName) {
  var tile = mvt.tile.decode(pbf);

  for (var i = 0; i < tile.layers.length; i++) {
    var name = tile.layers[i].name;
    if (name === layerName) {
      return tile.layers[i];
    }
  }
}
