const express = require('express');

const app = express();
const port = process.env.PORT || 8005;

app.use('/static', express.static(__dirname + '/static/'));

app.get('/', (req, res) => {
    res.sendFile('templates/index.html', { root: __dirname });
});

app.get('/gifts', (req, res) => {
    res.sendFile('templates/prizesPage.html', { root: __dirname });
});

app.get('/login', (req, res) => {
    res.sendFile('templates/login.html', { root: __dirname });
});

app.get('/suppliers', (req, res) => {
    res.sendFile('templates/supplierPage.html', { root: __dirname });
});

app.get('/stage_two', (req, res) => {
    res.sendFile('templates/gameStageTwo.html', { root: __dirname });
});

app.get('/conditions', (req, res) => {
    res.sendFile('templates/conditions.html', { root: __dirname });
});

app.get('/winners', (req, res) => {
    res.sendFile('templates/winners.html', { root: __dirname });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});