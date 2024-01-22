const fs = require('fs');
const path = require('path');
const promis = fs.promises;
const styles = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(dist);

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

    console.log(elName);
  });
});
