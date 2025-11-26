import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfLib = require('pdf-parse');
const fs = require('fs');

const pdfPath = 'public/books/primary4-quantitative.pdf';
const dataBuffer = fs.readFileSync(pdfPath);

try {
    const parser = new pdfLib.PDFParse();
    console.log('Instantiated parser');
} catch (e) {
    console.log('Failed to instantiate:', e.message);
}

// Maybe it has a process method?
console.log('Keys of PDFParse prototype:', Object.keys(pdfLib.PDFParse.prototype || {}));
