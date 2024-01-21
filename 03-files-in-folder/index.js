const { readdir, stat } = require('fs/promises');
const path = require('path');

// Utils
const convertFileSize = function (sizeInBytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  let ind = 0;

  let currentSize = sizeInBytes;

  while (currentSize >= 1024 && ind < sizes.length - 1) {
    currentSize /= 1024;
    ind += 1;
  }

  currentSize = currentSize.toFixed(3);

  return `${currentSize} ${sizes[ind]}`;
};

const printFileInfo = async (filePath) => {
  const fileStat = await stat(filePath);
  const { name, ext } = path.parse(filePath);
  const { size } = fileStat;
  const fileInfoStr = `${name} - ${ext.slice(1)} - ${convertFileSize(size)}`;

  console.log(fileInfoStr);
};

// Main
const folderPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const filesDirent = await readdir(folderPath, { withFileTypes: true });

    filesDirent.forEach((fileDirent) => {
      if (fileDirent.isFile()) {
        const { path: folderPath, name } = fileDirent;
        const filePath = path.join(folderPath, name);

        printFileInfo(filePath);
      }
    });
  } catch (err) {
    console.error(err);
  }
})();
