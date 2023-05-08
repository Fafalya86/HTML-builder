const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(destPath, 'bundle.css');

fs.readdir(srcPath, { withFileTypes: true }, async (err, items) => {
  if (err) {
    console.error(err);
    return;
  }

  const cssFiles = items.filter(
    (item) => item.isFile() && path.extname(item.name) === '.css');

  try {
    await fs.promises.mkdir(destPath, { recursive: true });

    const stylesPromises = cssFiles.map((file) =>
      fs.promises.readFile(path.join(srcPath, file.name), 'utf-8'));
    const styles = await Promise.all(stylesPromises);

    await fs.promises.writeFile(bundlePath, styles.join('\n'), 'utf-8');
    console.log('Styles merged successfully');
  } catch (err) {
    console.error(err);
  }
});