import babel from '@babel/core';
import generator from '@babel/generator';
import fs from 'fs';
import { readDir } from './utils';

export default (dirname, ignore) => {
    const files = readDir(dirname);
    files.forEach(file => {
        const ast = babel.parse(file, {
            plugins: ['jsx', 'classProperties', 'objectRestSpread'],
        });
        const newAST = babel.traverse(ast, {});
        const newCode = generator(newAST, {
            jsescOption: {
                minimal: true
            },
        });
    });
};
