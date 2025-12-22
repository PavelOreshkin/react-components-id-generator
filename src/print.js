const print = (text, type) => {
  switch (type) {
    case "green":
      console.log(`\x1b[32m${text}\x1b[0m`);
      break;
    case "red":
      console.error(`\x1b[31m${text}\x1b[0m`);
      break;
    default:
      console.log(text);
      break;
  }
};

module.exports = { print };
