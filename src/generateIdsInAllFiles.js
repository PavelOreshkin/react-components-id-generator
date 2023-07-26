const { addIdsToFile } = require("./addIdsToFile");

function generateIdsInAllFiles({ files, parsedConfig }) {
  files.forEach(((filePath) => {
    if (!filePath) {
      console.error("<paths> not found");
      process.exit(1);
    }
    try {
      addIdsToFile({ filePath, config: parsedConfig });
      console.log(`IDs added to file ${filePath}.`);
    } catch (error) {
      console.error(`Error adding IDs to file ${filePath}:`, error);
      process.exit(1);
    }
  }))
}

module.exports = { generateIdsInAllFiles };
