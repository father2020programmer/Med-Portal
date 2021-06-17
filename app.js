///////// Require Packages///////
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const https = require('https');
const bodyParser = require('body-parser');
const fs = require('./functions');
const schemas = require('./schemas');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const { json } = require('express');


/////// App Configure /////// 
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


/////DataBase Config////
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true)
mongoose.connect("mongodb+srv://Randy_Wilkins:Test1234@cluster0.td7ri.mongodb.net/Med_Portal", {useNewUrlParser: true});

///// Set up Mongoose models/////
const MD_Location = new mongoose.model('MD_Location', schemas.locations);
const Patient = new mongoose.model('Patients', schemas.patients);
const Employee = new mongoose.model('Employees', schemas.employees);


app.get('/', (req, res) => {

    //const ipApiKey = process.env.IP_API_KEY;
    //const ipUrl = 'https://api.ipgeolocation.io/ipgeo?apiKey=' + ipApiKey;

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
            let todayDate = fs.todaysDate();

           res.render('home', {               
                CR: fs.getCopyRights(), 
                dayDate: todayDate,
                cityName: name, 
                todayT: todayW.temp,
                todayI: todayW.weather[0].icon,
                todayD: todayW.weather[0].description,
                tomT: tomW.temp.day,
                tomI: tomW.weather[0].icon,
                tomD: tomW.weather[0].description,
                next1T: n1Day.temp.day,
                next1I: n1Day.weather[0].icon,
                next1D: n1Day.weather[0].description,
                next2T: n2Day.temp.day,
                next2I: n2Day.weather[0].icon,
                next2D: n2Day.weather[0].description,                
            });
        });

    });
    
});



app.get('/locations', (req, res) =>{
    
    MD_Location.find({}, (err, foundLocations) => {
        res.render('locations', {CR: fs.getCopyRights(), medLoc: foundLocations});
    }) 
    
});

app.get('/services', (req, res) =>{
    res.render('services', {CR: fs.getCopyRights()});
});

app.get('/myChart', (req, res) => {
    res.render('myChart', {CR: fs.getCopyRights()});
});

app.get('/login', (req, res) => {
    res.render('login', {CR: fs.getCopyRights()});
});

app.get('/clinic/:clinicID', (req, res) => {
    const clinicId = req.params.clinicID;
    const arrayDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saterday'];

    MD_Location.find({_id: clinicId}, (err, clinics) =>{
        if(err){

            console.log(err);
        }else {

            res.render('clinic', {CR: fs.getCopyRights(), clinic: clinics, day: arrayDays});
        }
    });

});















///// App Server/////
app.listen(3000, () => {
    console.log("Server is Running");
});
 