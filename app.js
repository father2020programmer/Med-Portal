///////// Require Packages///////
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const https = require('https');
const superagent = require('superagent');
const bodyParser = require('body-parser');
const fs = require('./functions');
const copyright = new Date().getFullYear()

/////// App Configure /////// 
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
const ipApiKey = process.env.IP_API_KEY;

////// App Main Pages//////
app.get('/', (req, res) => {    

    ////// get weather information at ip location ///////
    function getRawData(){
        return new Promise((resolve, reject) =>{
            https.get('https://api.ipgeolocation.io/ipgeo?apiKey=' + ipApiKey, res => {
                console.log('statusCode:', res.statusCode);
    
                res.on('data', d => {
                    let data = JSON.parse(d);
                    let cData = data.city
                    resolve(cData);
                }).on('error', e =>{
                    reject('error'. e.message);
                });
            });
        });
    }
    
    function getIp(){
        getRawData().then(data =>{
            return data;
        }).catch(error => {
            console.log(error);
        });
    }

    console.log(getIp());
    


    res.render('home', {CR: copyright});    
});

app.get('/locations', (req, res) =>{
    res.render('locations', {CR: copyright});
});

app.get('/services', (req, res) =>{
    res.render('services', {CR: copyright});
});

app.get('/myChart', (req, res) => {
    res.render('myChart', {CR: copyright});
});

























///// App Server/////
app.listen(3000, () => {
    console.log("Server is Running");
});
 