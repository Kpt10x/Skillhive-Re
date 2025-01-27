const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/submit', (req, res) => {
    const data = req.body;

    fs.readFile('mock.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return res.status(500).send('Error reading file');
        }

        let jsonData = [];
        if (jsonString) {
            jsonData = JSON.parse(jsonString);
        }

        jsonData.push(data);

        fs.writeFile('mock.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.log("Error writing file:", err);
                return res.status(500).send('Error writing file');
            }
            res.status(200).send('Data saved successfully');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});