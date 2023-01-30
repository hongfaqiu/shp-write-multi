var write = require('./write'),
  geojson = require('./geojson'),
  prj = require('./prj'),
  JSZip = require('jszip');

function handleName(arr) {
  let map = {};
  return arr.map(item => {
    map[item] = map[item] === undefined ? 0 : map[item] + 1;
    map[item] && (item += map[item]);
    return item;
  })
}

module.exports = async function (gj, options) {

  // handle input names, keep it from reapting
  let names = options.names ? handleName(options.names) : [];
  var zip = new JSZip(),
    layers = zip.folder(options && options.folder ? options.folder : 'layers');
  geojson.transform(gj).map((l, index) => {
    if (l.geometries.length && l.geometries[0].length) {
      write(
        // field definitions
        l.properties,
        // geometry type
        l.type,
        // geometries
        l.geometries,
        function (err, files) {
          // default name is folder name + feature type + index
          var fileName = names[index] ? names[index] : options.folder + '_' + l.type + '_' + index;
          layers.file(fileName + '.shp', files.shp.buffer, {
            binary: true
          });
          layers.file(fileName + '.shx', files.shx.buffer, {
            binary: true
          });
          layers.file(fileName + '.dbf', files.dbf.buffer, {
            binary: true
          });
          layers.file(fileName + '.prj', prj);
        });
    }
  });

  var generateOptions = {
    type: 'base64'
  };

  if (!process.browser) {
    generateOptions.type = 'nodebuffer';
  }

  const result = await zip.generateAsync(generateOptions);

  return result;
};