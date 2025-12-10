const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/', async (req, res) => {
    const params = new URLSearchParams(req.body).toString();
    console.log(req.body);
    const apiUrl = `https://api.dmm.com/affiliate/v3/ItemList?${params}&output=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(params);
        console.log(data.request);
        res.json(data.result.items);
    } catch (error) {
        res.status(500).json({ message: 'APIリクエストに失敗しました。', error: error.toString() });
    }
});

module.exports = router;
