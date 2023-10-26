const AdmZip = require("adm-zip");
const fs = require("fs");

const path = require("path");

let packageJsonPath = path.join(
  path.dirname(require.main.filename),
  "package.json"
);
const package = require(packageJsonPath);

// Helper function to create zip folder
async function createZipArchive(outputFolder) {
  const zip = new AdmZip();

  let name = package.name.toLowerCase();
  let version = package.version;
  let zipName = `${name}-${version}.zip`;

  let outputFile = `${outputFolder}/${zipName}`;
  let inputFolder = path.join(path.dirname(require.main.filename), "dist");

  outputFile = path.join(path.dirname(require.main.filename), outputFile);

  zip.addLocalFolder(inputFolder);
  zip.writeZip(outputFile);

  console.log(`Created ${outputFile} successfully`);

  return outputFile;
}

let archiveFolder = "artifacts";

let run = async function () {
  try {
    await fs.promises.access(archiveFolder);
  } catch (error) {
    await fs.promises.mkdir(archiveFolder);
  }

  await createZipArchive(archiveFolder);
};

run();
