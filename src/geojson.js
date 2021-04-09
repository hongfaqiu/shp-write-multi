module.exports.point = justType('Point', 'POINT');
module.exports.line = justType('LineString', 'POLYLINE');
module.exports.polygon = justType('Polygon', 'POLYGON');
module.exports.transform = transform;

// orgin code don't support mulitiple features, just output three types(point, polyline, polygon) .shp
// change to output mulityiple features, one feature in geojson outputs one .shp file, and then total .shp package into a .zip file
function transform(gj) {
  return gj.features.map(feature => {
    return {
      geometries: [feature.geometry.coordinates],
      properties: [feature.properties],
      type: feature.geometry.type.toUpperCase()
    }
  })
}

function justType(type, TYPE) {
    return function(gj) {
        var oftype = gj.features.filter(isType(type));
        return {
            geometries: (TYPE === 'POLYGON' || TYPE === 'POLYLINE') ? [oftype.map(justCoords)] : oftype.map(justCoords),
            properties: oftype.map(justProps),
            type: TYPE
        };
    };
}

function justCoords(t) {
    if (t.geometry.coordinates[0] !== undefined &&
        t.geometry.coordinates[0][0] !== undefined &&
        t.geometry.coordinates[0][0][0] !== undefined) {
        return t.geometry.coordinates[0];
    } else {
        return t.geometry.coordinates;
    }
}

function justProps(t) {
    return t.properties;
}

function isType(t) {
    return function(f) { return f.geometry.type === t; };
}
