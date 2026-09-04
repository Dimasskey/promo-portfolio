const express = require('express');
const app = express();
const port = process.env.PORT || 8005;

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use('/static', express.static(__dirname + '/static/'));
app.get('/', async (req, res) => {
    res.sendFile('templates/index.html', {root: __dirname });
});

app.get('/gifts', async (req, res) => {
    res.sendFile('templates/prizesPage.html', {root: __dirname });
});
app.get('/login', async (req, res) => {
    res.sendFile('templates/login.html', {root: __dirname });
});
app.get('/suppliers', async (req, res) => {
    res.sendFile('templates/supplierPage.html', {root: __dirname });
});
app.get('/stage_two', async (req, res) => {
    res.sendFile('templates/gameStageTwo.html', {root: __dirname });
});
app.get('/conditions', async (req, res) => {
    res.sendFile('templates/conditions.html', {root: __dirname });
});
app.get('/winners', async (req, res) => {
    res.sendFile('templates/winners.html', {root: __dirname });
});
