const express = require('express');
const path = require('path');
const searchItems = require('./api/searchItems');
const searchActress = require('./api/searchActress')
const searchFloor = require('./api/searchFloor');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// APIルート
app.use('/api/items', searchItems);
app.use('/api/actress', searchActress);
app.use('/api/floor', searchFloor);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
