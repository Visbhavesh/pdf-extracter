const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const mammoth = require('mammoth');
const cors = require('cors');
const anyText = require('any-text');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');



const app = express();

app.use(cors());
app.use(fileUpload());


app.post('/v3', async (req, res) => {
    if (!req.files || !req.files.dataFiles) {
        return res.status(400).send('No files were uploaded.');
    }

    const dataFiles = Array.isArray(req.files.dataFiles) ? req.files.dataFiles : [req.files.dataFiles];
    console.log(dataFiles);
    const extractedData = [];

    for (const file of dataFiles) {
        try {
            console.log("hello",file);
            const filePath = path.join(__dirname, 'uploads', file.name);
            await file.mv(filePath); 
            var stream = await fs.readFileSync(filePath);
            var workbook = await XLSX.read(stream, { type: 'buffer' });
            var worksheet = await workbook.Sheets[workbook.SheetNames[0]];
            var docs =await XLSX.utils.sheet_to_json(worksheet);
            console.log(docs);

            await extractedData.push({ fileName: file.name, data:docs });
          
            await fs.promises.unlink(filePath);
            res.json({ extractedData });
        } catch (error) {
            console.error('Error extracting data:', error);
            extractedData.push({ fileName: file.name, data: null });
            res.send(error);
        }
    }

    
});

app.listen(3001, () => {
    console.log("Server started at", 3001);
});
