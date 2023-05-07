const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf8');

readStream.on('data', (chunk) => {
    console.log(chunk);
});

readStream.on('error', (error) => {
    console.log('Error', error.message);
});