const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.load();

app.get('/',(req, res) => {
    res.send('Hi there');
});

app.listen(process.env.PORT || 3000);