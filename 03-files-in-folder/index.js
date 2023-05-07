const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, items) => {
  if (err) {
    console.error(err);
    return;
  }

const files = items.filter(item => item.isFile());
  files.forEach(file => {
    const filePath = path.join(folderPath, file.name);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      const fileName = path.parse(file.name).name;
      const fileExt = path.extname(file.name).slice(1);
      const fileSize = stats.size / 1024;
      console.log(`${fileName} - ${fileExt} - ${fileSize.toFixed(3)}kb`);
    });
  });
});