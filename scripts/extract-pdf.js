import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfPath = 'public/books/primary4-quantitative.pdf';

async function extractText() {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument(data);
    const pdfDocument = await loadingTask.promise;

    console.log('Pages:', pdfDocument.numPages);
    let fullText = '';

    for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    }

    console.log(fullText);
    fs.writeFileSync('temp_content.txt', fullText);
}

extractText().catch(console.error);
