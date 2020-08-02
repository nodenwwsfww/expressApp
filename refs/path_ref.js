const path = require('path');
console.log('////');
console.log(path.basename(__filename));
console.log(path.dirname(__dirname));
console.log(path.extname(__filename));

console.log(path.parse(__filename));

console.log(path.join(__dirname, './test', '/second.html'));
console.log(path.resolve(__dirname, 'static_files/png/', '../gif/image.gif'));
console.log(path.normalize('/foo/bar//baz/asdf/quux/'));
console.log('////');