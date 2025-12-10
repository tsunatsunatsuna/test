const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/', async (req, res) => {
    const params = new URLSearchParams(req.body).toString();
    const apiUrl = `https://api.dmm.com/affiliate/v3/FloorList?${params}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data.result.site);
    } catch (error) {
        res.status(500).json({ message: 'APIリクエストに失敗しました。', error: error.toString() });
    }
});

module.exports = router;
