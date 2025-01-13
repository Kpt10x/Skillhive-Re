const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle form submission
app.post('/api/courses', (req, res) => {
    const data = req.body;

    // Define the path to the JSON file
    const filePath = path.join(__dirname, 'mock.json');

    // Read the existing data from the JSON file
    fs.readFile(filePath, 'utf8', (err, jsonString) => {
        if (err) {
            console.error("File read failed:", err);
            return res.status(500).send('Error reading file');
        }

        let jsonData = [];
        if (jsonString) {
            try {
                jsonData = JSON.parse(jsonString);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                return res.status(500).send('Error parsing JSON');
            }
        }

        // Add the new data to the existing data
        jsonData.push(data);

        // Write the updated data back to the JSON file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send('Error writing file');
            }
            res.status(200).send('Data saved successfully');
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});