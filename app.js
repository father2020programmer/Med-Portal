///////// Require Packages///////
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const https = require('https');
const bodyParser = require('body-parser');
const fs = require('./functions');
const mongoose = require('mongoose');
const superagent = require('superagent');
const fetch = require('node-fetch');
const { json } = require('express');


/////// App Configure /////// 
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
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

    const ipApiKey = process.env.IP_API_KEY;
    const ipUrl = 'https://api.ipgeolocation.io/ipgeo?apiKey=' + ipApiKey;

    function requestIP(url){
        return fetch(url)
        .then(r => r.json())
        .then(json => json);
    }   
    
    requestIP(ipUrl).then(data =>{
        const part ='hourly,alerts,minutely';
        const lat = data.latitude;
        const lon = data.longitude;
        const name = data.city;
        const apiKey = process.env.WEATHER_API_KEY;
        const units = "imperial";
        const urlWeather = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=' + units + '&exclude=' + part + '&appid=' + apiKey;

        fetch(urlWeather)
        .then(r => r.json())
        .then(json =>{
            let todayW = json.current;
            let tomW = json.daily[0];
            let n1Day = json.daily[1];
            let n2Day = json.daily[2];

           res.render('home', {
                CR: copyright, 
                cityName: name, 
                todayT: todayW.temp,
                todayM: todayW.weather[0].main,
                todayD: todayW.weather[0].description,
                tomT: tomW.temp.day,
                tomM: tomW.weather[0].main,
                tomD: tomW.weather[0].description,
                next1T: n1Day.temp.day,
                next1M: n1Day.weather[0].main,
                next1D: n1Day.weather[0].description,
                next2T: n2Day.temp.day,
                next2M: n2Day.weather[0].main,
                next2D: n2Day.weather[0].description,                
            });
        });

    });
    
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
 