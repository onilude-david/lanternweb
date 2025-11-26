import * as pdfModule from 'pdf-parse';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfRequire = require('pdf-parse');

console.log('Import * as:', pdfModule);
console.log('Require:', pdfRequire);

if (typeof pdfModule.default === 'function') {
    console.log('Found default export function via import');
}

if (typeof pdfRequire === 'function') {
    console.log('Found function via require');
} else if (typeof pdfRequire.default === 'function') {
    console.log('Found default export function via require');
} else {
    console.log('No function found. Keys:', Object.keys(pdfRequire));
}
