const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000; // Or your desired port

app.use(express.json()); // For parsing JSON bodies

app.post('/save-form-data', (req, res) => {
  const formData = req.body;
  const dataToWrite = `${JSON.stringify(formData)}\n`; // Add a newline for multiple entries

  fs.appendFile('formData.txt', dataToWrite, err => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data');
    } else {
      res.send('Data saved successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
