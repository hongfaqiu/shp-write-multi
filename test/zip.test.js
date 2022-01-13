const expect = require('expect.js');
const zip = require('../src/zip');

const options = {
  folder: 'myshapes',
  names: ['test','test1']
}

const geoJson = {
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
}

  describe('zip method', function() {
    it('returns a buffer', async function() {
      const buffer = await zip(geoJson, options);
      expect(buffer instanceof Buffer).to.equal(true);
    });
  })
