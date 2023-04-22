const { program } = require('commander');
const { addIdToElements } = require('./index');

program
  .option('-p, --path <path>', 'Path to the file with React components')
  .option('-i, --id <id>', 'ID prefix for elements')
  .parse(process.argv);

if (!program.path || !program.id) {
  console.error('Please provide path to the file with React components and ID prefix for elements');
  process.exit(1);
}

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const react = require('react');

const code = fs.readFileSync(path.resolve(program.path), 'utf-8');

const transformedCode = babel.transformSync(code, {
  presets: ['@babel/preset-react'],
  plugins: [
    [
      'babel-plugin-react-transform',
      {
        transforms: [{
          transform: function (code, file) {
            console.log('code: ', code);
            console.log('file: ', file);
            const elements = eval(code);
            console.log('elements: ', elements);
            const newElements = addIdToElements(program.id, elements);
            console.log('newElements: ', newElements);
            return react.createElement(react.Fragment, null, newElements);
          }
        }]
      }
    ]
  ]
});

fs.writeFileSync(path.resolve(program.path), transformedCode.code, 'utf-8');

console.log(`ID prefix ${program.id} added to elements in ${program.path}`);