const {error} = require('console');
const fs = require('fs');
const path = require('path');
const promis = fs.promises;
const styles = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist');
const template = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');
const assets = path.join(__dirname, 'assets');
const distAssets = path.join(dist, 'assets');

makeDist();
makeDistAssets();
copyImg();
copyFont();
copySvg();
createIndexFile();
combineStyles();

function makeDist() {
  fs.mkdir(dist, { recursive: true }, (error) => {
    if (error) throw error;
  });
}

function makeDistAssets() {
  fs.mkdir(path.join(dist, 'assets'), { recursive: true }, (error) => {
    if (error) throw error;
  });
}

function createIndexFile() {
  let content = '';

  fs.readFile(template, 'utf-8', (error, data) => {
    content = content + data.toString();
    fs.readdir(components, (error, data) => {
      if (error) throw error;
      data.forEach((el) => {
        const elPath = path.join(styles, el);
        const elExt = path.extname(elPath);
        const elName = path.basename(elPath);

        if (elExt !== '.html') return;
        const elNameWithoutExt = elName.replace(elExt, '');
        const alias = `{{${elNameWithoutExt}}}`;

        fs.readFile(path.join(components, elName), 'utf-8', (error, elData) => {
          if (error) throw error;
          content = content.replace(alias, elData);
          fs.writeFile(path.join(dist, 'index.html'), content, (error) => {
            if (error) throw error;
          });
        });
      });
    });
  });
}

function combineStyles() {
  const output = fs.createWriteStream(path.join(dist, 'style.css'));

  promis.readdir(styles).then((res) => {
    res.forEach((el) => {
      const elPath = path.join(styles, el);
      const elExt = path.extname(elPath);
      if (elExt !== '.css') return;
      const elName = path.basename(elPath);
      const stylesContent = fs.createReadStream(path.join(styles, elName));
      stylesContent.on('data', (data) => {
        output.write(data);
      });
    });
  });
}

function copyFont() {
  fs.mkdir(path.join(distAssets, 'fonts'), { recursive: true }, (error) => {
    if (error) throw error;
  });

  fs.readdir(path.join(assets, 'fonts'), (error, data) => {
    if (error) throw error;
    data.forEach((el) => {
      const elPath = path.join(assets, 'fonts', el);
      fs.copyFile(elPath, path.join(distAssets, 'fonts', el), (error) => {
        if (error) throw error;
      });
    });
  });
}

function copyImg() {
  fs.mkdir(path.join(distAssets, 'img'), { recursive: true }, (error) => {
    if (error) throw error;
  });

  fs.readdir(path.join(assets, 'img'), (error, data) => {
    if (error) throw error;
    data.forEach((el) => {
      const elPath = path.join(assets, 'img', el);
      fs.copyFile(elPath, path.join(distAssets, 'img', el), (error) => {
        if (error) throw error;
      });
    });
  });
}

function copySvg() {
  fs.mkdir(path.join(distAssets, 'svg'), { recursive: true }, (error) => {
    if (error) throw error;
  });

  fs.readdir(path.join(assets, 'svg'), (error, data) => {
    if (error) throw error;
    data.forEach((el) => {
      const elPath = path.join(assets, 'svg', el);
      fs.copyFile(elPath, path.join(distAssets, 'svg', el), (error) => {
        if (error) throw error;
      });
    });
  });
}
