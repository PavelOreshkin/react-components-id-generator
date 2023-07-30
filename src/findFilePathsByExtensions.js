const fs = require('fs');
const path = require('path');

function findFilePathsByExtensions(paths, extensions) {
  let files = [];

  function traverse(dirPath) {
    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
      const itemPath = path.join(dirPath, item);
      const isDirectory = fs.statSync(itemPath).isDirectory();

      if (isDirectory) {
        // Recursive call to traverse subfolders
        traverse(itemPath);
      } else {
        const fileExtension = path.extname(item);

        if (extensions.includes(fileExtension)) {
          files.push(itemPath);
        }
      }
    });
  }

  paths.forEach((item) => {
    const isDirectory = fs.statSync(item).isDirectory();

    if (isDirectory) {
      // Recursive call to traverse subfolders
      traverse(item);
    } else {
      const fileExtension = path.extname(item);

      if (extensions.includes(fileExtension)) {
        files.push(item);
      }
    }
  });

  return files;
}

module.exports = { findFilePathsByExtensions };
