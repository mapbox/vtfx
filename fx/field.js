module.exports = fx;

function fx(layer, options) {
	// var features = options.features || [];
    var field = options.field || null;
    var value = options.value || null;

    // for (id in layer.features) {
    // 	for (var i = 0; i < layer.features[id].tags.length; i +=2 ){
    // 		var featureKey = layer.keys[layer.features[id].tags[i]];
    // 		var featureValue = layer.values[layer.features[id].tags[i+1]].string_value;
    // 		if (featureKey === field && featureValue === value){
    // 			console.log(value)
    // 		}
    // 	}    
    // }

    var features = {};
    for (id in layer.features) {
    	for (var i = 0; i < layer.features[id].tags.length; i +=2 ){
    		var featureKey = layer.keys[layer.features[id].tags[i]];
    		var featureValue = layer.values[layer.features[id].tags[i+1]].string_value;
    		if (featureKey === field && featureValue === value){
    			features[id] = layer.features[id];
    		}
    	}
    }
    return features
}