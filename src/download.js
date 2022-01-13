var zip = require('./zip');

module.exports = async function(gj, options) {
    var content = await zip(gj, options);
    location.href = 'data:application/zip;base64,' + content;
};
