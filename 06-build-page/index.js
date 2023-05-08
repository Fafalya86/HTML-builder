const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');

async function buildPage() {
  try {
    await fs.promises.mkdir(distPath, { recursive: true });

    const template = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
    
    const components = await fs.promises.readdir(componentsPath, { withFileTypes: true });
    let resultHTML = template;
    
    for (const component of components) {
      if (component.isFile() && path.extname(component.name) === '.html') {
        const componentName = path.basename(component.name, '.html');
        const componentContent = await fs.promises.readFile(path.join(componentsPath, component.name), 'utf-8');
        const regex = new RegExp(`{{${componentName}}}`, 'g');
        resultHTML = resultHTML.replace(regex, componentContent);
      }
    }
    
    await fs.promises.writeFile(path.join(distPath, 'index.html'), resultHTML, 'utf-8');

    const styles = await fs.promises.readdir(stylesPath, { withFileTypes: true });
    const cssFiles = styles.filter(file => file.isFile() && path.extname(file.name) === '.css');
    const cssContentPromises = cssFiles.map(file => fs.promises.readFile(path.join(stylesPath, file.name), 'utf-8'));
    const cssContents = await Promise.all(cssContentPromises);
    await fs.promises.writeFile(path.join(distPath, 'style.css'), cssContents.join('\n'), 'utf-8');

    async function copyDir(src, dest) {
      await fs.promises.mkdir(dest, { recursive: true });
      const items = await fs.promises.readdir(src, { withFileTypes: true });
      await Promise.all(items.map(async (item) => {
        const srcItemPath = path.join(src, item.name);
        const destItemPath = path.join(dest, item.name);
        if (item.isFile()) {
          await fs.promises.copyFile(srcItemPath, destItemPath);
        } else if (item.isDirectory()) {
          await copyDir(srcItemPath, destItemPath);
        }
      }));
    }
    await copyDir(assetsPath, path.join(distPath, 'assets'));

    console.log('Build successful');
  } catch (err) {
    console.error(err);
  }
}

buildPage();