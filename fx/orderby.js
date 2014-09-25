module.exports = fx;

function fx(layer, options) {
    var field = options.field;

    if (field && layer.keys.indexOf(field) === -1) {
        console.log(new Error("field "+field+" does not exist"));
    }
    if (!field && sort) {
        console.log(new Error('order by is not set'))
    } else {
        var sort = options.sort || 0; // 0 asc, 1 desc
    }
}