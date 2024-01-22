const fs = require('fs');
const path = require('path');
const promis = fs.promises;
const styles = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist');
const template = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');
const componentsObj = {};

makeDist();
createIndexFile();
combineStyles();

function makeDist() {
  fs.mkdir(dist, { recursive: true }, (error) => {
    if (error) {
      throw new Error('Error: unable to create directory');
    } else {
      console.log('Success: create directory');
    }
  });
}

function createIndexFile() {
  const output = fs.createWriteStream(path.join(dist, 'index.html'));
  const input = fs.createReadStream(template, 'utf-8');
  let content = [];

  input.on('data', (data) => {
    let inputData = data.toString();
    fs.readdir(components, (error, data) => {
      if (error) throw error;
      data.forEach((el) => {
        const elPath = path.join(styles, el);
        const elExt = path.extname(elPath);
        const elName = path.basename(elPath);

        if (elExt !== '.html') return;
        const elNameWithoutExt = elName.replace(elExt, '');
        const alias = `{{${elNameWithoutExt}}}`;
        const elContent = fs.createReadStream(path.join(components, elName), 'utf-8');

        if (inputData.indexOf(alias) >= 0) {
          elContent
            .on('data', (elData) => {
              let item = {
                [elNameWithoutExt]: elData.toString(),
              };
              content.push(item);
            })
            .on('end', () => {
              return content;
            });
        }

        console.log(content);
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
