const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require('axios'); 
const cheerio = require('cheerio'); 
const router = express.Router();
const bodyParser = require('body-parser');
const controller = require('../controllers/index');

router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/popular',controller.popular);
router.get('/chapters',controller.chapters);
router.get('/pages',controller.pages);
router.post('/search',controller.search);
router.get('/*',(req,res)=>{
    res.json({
        status: false,
        stack:  "endpoint not found",
    });
})

module.exports = router;