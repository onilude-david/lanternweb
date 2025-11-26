import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const pdf = require('pdf-parse-fork');

const pdfPath = 'public/books/primary4-quantitative.pdf';
const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
    fs.writeFileSync('temp_content.txt', data.text);
}).catch(console.error);
