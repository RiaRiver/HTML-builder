const { mkdir, readdir, copyFile, rm } = require('fs/promises');
const path = require('path');

const copyDir = async (src, dest) => {
  try {
    await rm(dest, { recursive: true, force: true });
    await mkdir(dest, { recursive: true });

    const filesDirent = await readdir(src, { withFileTypes: true });

    filesDirent.forEach((fileDirent) => {
      const srcPath = path.join(fileDirent.path, fileDirent.name);
      const destPath = path.join(dest, fileDirent.name);

      if (fileDirent.isFile()) {
        copyFile(srcPath, destPath);
      } else {
        copyDir(srcPath, destPath);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

const folderPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

copyDir(folderPath, destPath);
