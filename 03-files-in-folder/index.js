const fs = require('fs');
const path = require('path');
const promis = fs.promises;
const secretFolder = path.join(__dirname, 'secret-folder');

promis.readdir(secretFolder, { withFileTypes: true }).then((res) => {
  res.forEach((el) => {
    if (el.isDirectory()) {
      return;
    } else {
      const elPath = path.join(secretFolder, el.name);
      const elName = path.basename(elPath);
      const elExt = path.extname(elPath);
      promis.stat(elPath).then((out) => {
        const elNameWithoutExt = elName.replace(elExt, '');
        const elExtWithoutDot = elExt.replace('.', '');
        const elSize = out.size;
        console.log(`${elNameWithoutExt} - ${elExtWithoutDot} - ${elSize}`);
      });
    }
  });
});
