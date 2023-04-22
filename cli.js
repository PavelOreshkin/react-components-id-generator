const { addIdsToFile } = require("./index");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: npx react-components-id-generator <path>");
  process.exit(1);
}

const filePath = args[0];

console.log(`Adding IDs to file ${filePath}...`);

try {
  addIdsToFile(filePath);
  console.log(`IDs added to file ${filePath}.`);
} catch (error) {
  console.error(`Error adding IDs to file ${filePath}:`, error);
  process.exit(1);
}