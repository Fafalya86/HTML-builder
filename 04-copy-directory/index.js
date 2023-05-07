const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

function copyDir(src, dest) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.readdir(src, { withFileTypes: true }, (err, items) => {
      if (err) {
        console.error(err);
        return;
      }
      items.forEach((item) => {
        const srcItemPath = path.join(src, item.name);
        const destItemPath = path.join(dest, item.name);

        if (item.isFile()) {
          fs.copyFile(srcItemPath, destItemPath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        } else if (item.isDirectory()) {
          copyDir(srcItemPath, destItemPath);
        }
      });
    });
  });
}
copyDir(srcPath, destPath);
