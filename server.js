const express = require('express');
const app = express();
const PORT  = process.env.PORT | 3000;
const route = require('./routes/route');
// const axios = require('axios'); 
// const cheerio = require('cheerio'); 
// var FormData = require('form-data');

app.use('/',route);

app.listen(PORT,() => {
    console.log(`Server is running in http://127.0.0.1:${PORT}`);
});