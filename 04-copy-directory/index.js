const fs = require('fs');
const path = require('path');
const promis = fs.promises;
const filesFolder = path.join(__dirname, 'files');
const filesCopyFolder = path.join(__dirname, 'files-copy');
const copy = promis.copyFile;

fs.mkdir(filesCopyFolder, (error) => {
  if (error) {
    throw new Error('Error: unable to create directory');
  } else {
    console.log('Success: create directory');
  }
});

promis.readdir(filesFolder, { withFileTypes: true }).then((res) => {
  res.forEach((el) => {
    if (el.isDirectory()) {
      return;
    } else {
      const elPath = path.join(filesFolder, el.name);
      copy(elPath, path.join(filesCopyFolder, el.name));
      console.log(el);
    }
  });
});
