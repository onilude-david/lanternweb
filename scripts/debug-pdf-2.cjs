const pdfParse = require('pdf-parse');
console.log(pdfParse);
try {
    pdfParse(Buffer.from('test')).catch(e => console.log('Error calling as function:', e.message));
} catch (e) {
    console.log('Cannot call as function:', e.message);
}
