const { readdir, writeFile, readFile, appendFile } = require('fs/promises');
const path = require('path');

const bundlePath = path.join(__dirname, 'project-dist/bundle.css');
const srcFolderPath = path.join(__dirname, 'styles');

(async () => {
  try {
    await writeFile(bundlePath, '');

    const filesDirent = await readdir(srcFolderPath, { withFileTypes: true });

    for (const fileDirent of filesDirent) {
      const filePath = path.join(srcFolderPath, fileDirent.name);
      const ext = path.extname(filePath);

      if (fileDirent.isFile() && ext === '.css') {
        const content = await readFile(filePath);

        appendFile(bundlePath, content);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
