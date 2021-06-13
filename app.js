///////// Require Packages///////
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const https = require('https');
const bodyParser = require('body-parser');
const fs = require('./functions');
const mongoose = require('mongoose');
const _ = require('lodash');


/////// App Configure /////// 
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
const mapKey = process.env.MAP_KEY;
const copyright = new Date().getFullYear()

/////DataBase Config////
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true)
mongoose.connect("mongodb+srv://Randy_Wilkins:Test1234@cluster0.td7ri.mongodb.net/Med_Portal", {useNewUrlParser: true});

const locationScheme = new mongoose.Schema({
    name: String,
    address: String,
    hours: Array,
    imgURL: String,
    mapURL: String,
    services: Array
}, {collection: 'MD_Location'});

const MD_Location = new mongoose.model('MD_Location', locationScheme);


////// App Main Pages//////
app.get('/', (req, res) => {    

    ////// get weather information at ip location ///////
    // function getRawData(){
    //     return new Promise((resolve, reject) =>{
    //         https.get('https://api.ipgeolocation.io/ipgeo?apiKey=' + ipApiKey, res => {
    //             console.log('statusCode:', res.statusCode);
    
    //             res.on('data', d => {
    //                 let data = JSON.parse(d);
    //                 let cData = data.city
    //                 resolve(cData);
    //             }).on('error', e =>{
    //                 reject('error'. e.message);
    //             });
    //         });
    //     });
    // }
    
    // function getIp(){
    //     getRawData().then(data =>{
    //         return data;
    //     }).catch(error => {
    //         console.log(error);
    //     });
    // }

    // console.log(getIp());
    


    res.render('home', {CR: copyright});    
});



app.get('/locations', (req, res) =>{
    
    MD_Location.find({}, (err, foundLocations) => {
        res.render('locations', {CR: copyright, medLoc: foundLocations});
    }) 
    
});

app.get('/services', (req, res) =>{
    res.render('services', {CR: copyright});
});

app.get('/myChart', (req, res) => {
    res.render('myChart', {CR: copyright});
});

app.get('/clinic/:clinicID', (req, res) => {
    const clinicId = req.params.clinicID;
    const arrayDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saterday'];

    MD_Location.find({_id: clinicId}, (err, clinics) =>{
        if(err){

            console.log(err);
        }else {

            res.render('clinic', {CR: copyright, clinic: clinics, day: arrayDays});
        }
    });

});















///// App Server/////
app.listen(3000, () => {
    console.log("Server is Running");
});
 