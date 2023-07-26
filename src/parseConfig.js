const fs = require('fs');

function parseConfig () {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: npx react-components-id-generator --config <path>");
    process.exit(1);
  }

  const configPath = args[0] === '--config' && args[1] ? args[1] : null;
  if (!configPath) {
    console.error("You must add --config");
    console.error("Example: npx react-components-id-generator --config generator.config.json");
    process.exit(1);
  }
  const configJson = fs.readFileSync(configPath, { encoding: 'utf-8' })
  const parsedConfig = JSON.parse(configJson);
  return parsedConfig;
}

module.exports = { parseConfig };
