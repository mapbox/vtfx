var fs = require('fs');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();
var vtfx = require('../index.js');

var functions = [
  { name: 'drop100', options: {'poi_label':[{id:'drop', limit:100}]}},
  { name: 'labelgrid1024', options: {'poi_label':[{id:'labelgrid', size:1024}]}},
  { name: 'orderby-scalerank', options: {'poi_label':[{id:'orderby', field:'scalerank'}]}},
  { name: 'linelabel-class', options: {'poi_label':[{id:'orderby', field:'scalerank'}]}}
];

var fixture = fs.readFileSync(__dirname + '/before.pbf');

console.log('Benchmarks for VTFX (this may take a few minutes): ');

// add tests
functions.forEach(function(fn) {
  suite.add({
      name: 'vtfx#' + fn.name,
      fn: function() {
        this.vtfx(this.fixture, this.fx.options, function(){});
      },
      fixture: fixture,
      fx: fn,
      vtfx: vtfx
    });
});

// add listeners
suite.on('cycle', function(event) {
  console.log(String(event.target), event.target.hz);
})
.run();
