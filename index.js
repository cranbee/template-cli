#! /usr/bin/env node

let FS = require('fs');
let Program = require('commander');
let Template = require('@cranbee/template');
let Package = require('./package.json');

// () => void
function main() {
    Program.version(Package.version);
    Program.command('compile <file>').action(compile);
    Program.parse(process.argv);
    if (Program.args.length < 2) {
        Program.help();
    }
}

// string => void
function compile(srcFile) {
    let input = FS.readFileSync(srcFile, 'utf-8');
    let lines = input.split(/\r\n|\r|\n/g);
    let text = lines.join('\n');
    let tokens = null;
    let ast = null;
    try {
        tokens = Template.scan(text);
        ast = Template.parse(tokens);
    } catch (err) {
        if (err.name === 'SyntaxError') {
            printError(srcFile, lines, err);
            process.exit(1);
        } else {
            throw err;
        }
    }
    let packet = Template.pack(ast);
    let output = JSON.stringify(packet);
    console.log(output);
}

// (string, array, object) => void
function printError(srcFile, lines, err) {
    let lc = getLC(lines, err.pos);
    let spaces = ' '.repeat(lc.column - 1);
    console.error(`${srcFile}: ${err.message} at ${lc.line}:${lc.column}`);
    console.error(lines[lc.line - 1]);
    console.error(`${spaces}^`);
}

// (array, number) => object
function getLC(lines, pos) {
    let n = lines.length;
    let lineStart = 0;
    for (let i = 0; i < n - 1; i++) {
        let lineLength = lines[i].length;
        if (pos <= lineStart + lineLength) {
            return { line: i + 1, column: pos - lineStart + 1 };
        }
        lineStart += (lineLength + 1);
    }
    return { line: n, column: pos - lineStart + 1 };
}

main();
