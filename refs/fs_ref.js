const fs = require('fs');
const path = require('path');

// fs - fileSystem

fs.mkdir( path.join(__dirname, 'notes'), err => {
    if (err) throw err;

    console.log('The directory had created');
}); */

/* fs.readFile(path.join(__dirname, './notes/test.txt'), {
    encoding: 'utf-8'
}, (err, data) => {
    if (err) throw err;
    console.log(data);
});

fs.rename( path.join(__dirname, './notes/test.txt'), path.join(__dirname, './notes/notes.txt'), err => {
    if (err) throw err;
})