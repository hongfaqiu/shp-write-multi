[![Build Status](https://secure.travis-ci.org/mapbox/shp-write.svg?branch=master)](http://travis-ci.org/mapbox/shp-write)

# shp-write-multi

``origin repository`` [shp-write](https://github.com/mapbox/shp-write)

Writes shapefile in pure javascript. Uses [dbf](https://github.com/tmcw/dbf)
for the data component, and [jsZIP](http://stuk.github.io/jszip/) to generate
ZIP file downloads in-browser.

## Usage

For node.js or [browserify](https://github.com/substack/node-browserify)

    npm install --save shp-write-multi
Or in a browser

    https://unpkg.com/shp-write-multi@latest/shpwrite.js

## Caveats

* Requires a capable fancy modern browser with [Typed Arrays](http://caniuse.com/#feat=typedarrays)
  support
* Geometries: Point, LineString, Polygon, MultiLineString, MultiPolygon
* Tabular-style properties export with Shapefile's field name length limit
* Uses jsZip for ZIP files, but [compression is buggy](https://github.com/Stuk/jszip/issues/53) so it uses STORE instead of DEFLATE.

## Example

```js
var shpwrite = require('shp-write-multi');

// (optional) set names for features and zipped folder
var options = {
  folder: 'myshapes',
    // output .shp name with geojson's features, default is ['myshpes_POINT_1', 'myshpes_POINT_2']
    names: ['test','test1']
}
// a GeoJSON bridge for features
await shpwrite.download({
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            },
            properties: {
                name: 'Foo'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 10]
            },
            properties: {
                name: 'Bar'
            }
        }
    ]
}, options);
// triggers a download of a zip file with shapefiles contained within.
```

output file

```js
download.zip
└── myshapes
    ├── test.dbf
    ├── test.prj
    ├── test.shp
    ├── test.shx
    ├── test1.dbf
    ├── test1.prj
    ├── test1.shp
    └── test1.shx
```

## API

### `download(geojson)` ⇒ Asynchronous call

Given a [GeoJSON](http://geojson.org/) FeatureCollection as an object,
converts convertible features into Shapefiles and triggers a download.

### `write(data, geometrytype, geometries, callback)` ⇒ Synchronous call

Given data, an array of objects for each row of data, geometry, the OGC standard
geometry type (like `POINT`), geometries, a list of geometries as bare coordinate
arrays, generate a shapfile and call the callback with `err` and an object with

```js
{
    shp: DataView(),
    shx: DataView(),
    dbf: DataView()
}
```

### `zip(geojson)` ⇒ Asynchronous call

Generate a ArrayBuffer of a zipped shapefile, dbf, and prj, from a GeoJSON
object.
