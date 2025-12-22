const { addIdsToFile } = require("./addIdsToFile");
const { print } = require("./print");

const textMessageByAction = (action) => {
  if (action === "delete") return "deleting from";
  if (action === "onlyCreate") return "creating in";
  if (action === "onlyUpdate") return "updating in";
  if (action === "createAndUpdate") return "creating and updating in";
  return "creating and updating in";
};

async function generateIdsInAllFiles({ files, config }) {
  files.forEach((filePath) => {
    if (!filePath) {
      print("<paths> not found", "red");
      process.exit(1);
    }
    try {
      addIdsToFile({ filePath, config });
      print(
        `IDs ${textMessageByAction(config?.action)} file ${filePath}.`,
        "green"
      );
    } catch (error) {
      print(
        `Error during IDs ${textMessageByAction(config?.action)} file ${filePath}:`,
        "red"
      );
      print(error);
    }
  });
}

module.exports = { generateIdsInAllFiles };
