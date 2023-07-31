const { addIdsToFile } = require("./addIdsToFile");
const { print } = require("./print");

async function generateIdsInAllFiles({ files, parsedConfig }) {
  files.forEach(((filePath) => {
    if (!filePath) {
      print("<paths> not found", "red")
      process.exit(1);
    }
    try {
      addIdsToFile({ filePath, config: parsedConfig });
      print("IDs added to file ${filePath}.", "green")
    } catch (error) {
      print("Error adding IDs to file ${filePath}:", "red")
      print(error)
    }
  }))
}

module.exports = { generateIdsInAllFiles };
