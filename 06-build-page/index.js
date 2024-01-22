const { createWriteStream, createReadStream } = require('fs');
const { mkdir, readdir, copyFile, rm, readFile, writeFile } = require('fs/promises');
const path = require('path');
const { pipeline } = require('stream/promises');

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

const concatFiles = async (src, dest, bundleName) => {
  const bundlePath = path.join(dest, bundleName);
  const outputFileStream = createWriteStream(bundlePath);

  try {
    const filesDirent = await readdir(src, { withFileTypes: true });

    for (const fileDirent of filesDirent) {
      const filePath = path.join(src, fileDirent.name);
      const ext = path.extname(filePath);

      if (fileDirent.isFile() && ext === '.css') {
        const inputFileStream = createReadStream(filePath);

        await pipeline(inputFileStream, outputFileStream, { end: false });
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const replaceComponentTags = async (templatePath, componentsPath, dest, htmlName) => {
  const template = await readFile(templatePath, 'utf-8');

  const componentsDirent = await readdir(componentsPath, { withFileTypes: true });
  const componentsContent = {};

  for (const componentDirent of componentsDirent) {
    const filePath = path.join(componentsPath, componentDirent.name);
    const ext = path.extname(filePath);

    if (componentDirent.isFile() && ext === '.html') {
      const name = path.parse(filePath).name;

      componentsContent[name] = await readFile(filePath);
    }

  }

  const htmlPath = path.join(dest, htmlName);

  const resultHTML = template.replace(/\{\{(\w+)\}\}/g, (m, p) => componentsContent[p] || '')

  await writeFile(htmlPath, resultHTML);
}

(async () => {
  const distFolder = 'project-dist';
  const distPath = path.join(__dirname, distFolder)

  await rm(distPath, { recursive: true, force: true });
  await mkdir(distPath, { recursive: true });

  // Copy assets
  const assetsFolder = 'assets';
  const assetsPath = path.join(__dirname, assetsFolder);
  const assetsDestPath = path.join(distPath, assetsFolder);

  copyDir(assetsPath, assetsDestPath);

  // Merge styles
  const stylesFolder = 'styles';
  const stylesPath = path.join(__dirname, stylesFolder);

  concatFiles(stylesPath, distPath, 'style.css')

  // Replace component tags
  const templateName = 'template.html';
  const htmlName = 'index.html';
  const componentsFolder = 'components';
  const templatePath = path.join(__dirname, templateName);
  const componentsPath = path.join(__dirname, componentsFolder);

  replaceComponentTags(templatePath, componentsPath, distPath, htmlName)
})();
