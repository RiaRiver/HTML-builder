const { createWriteStream, createReadStream } = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
const { pipeline } = require('stream/promises');

const bundlePath = path.join(__dirname, 'project-dist/bundle.css');
const srcFolderPath = path.join(__dirname, 'styles');
const outputFileStream = createWriteStream(bundlePath);

(async () => {
  try {
    const filesDirent = await readdir(srcFolderPath, { withFileTypes: true });

    for (const fileDirent of filesDirent) {
      const filePath = path.join(srcFolderPath, fileDirent.name);
      const ext = path.extname(filePath);

      if (fileDirent.isFile() && ext === '.css') {
        const inputFileStream = createReadStream(filePath);

        await pipeline(inputFileStream, outputFileStream, { end: false });
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
