const fs = require('fs');
const { print } = require('./print');

function parseConfig () {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    print("Usage: npx react-components-id-generator --config <path>")
    process.exit(1);
  }

  const configPath = args[0] === '--config' && args[1] ? args[1] : null;
  if (!configPath) {
    print("You must add --config");
    print("Example: npx react-components-id-generator --config id-generator.config.json");
    process.exit(1);
  }
  const configJson = fs.readFileSync(configPath, { encoding: 'utf-8' })
  const parsedConfig = JSON.parse(configJson);
  return parsedConfig;
}

module.exports = { parseConfig };
