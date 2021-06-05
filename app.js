///////// Require Packages///////
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const https = require('https');
const bodyParser = require('body-parser');
const { response } = require('express');
const copyright = new Date().getFullYear()

/////// App Configure /////// 
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

////// App Main Pages//////
app.get('/', (req, res) => {
    
    const urlIP = 'https://ip-api.com/json/?fields=status,city,query';    

    https.get(urlIP, response => {        
        response.on('data', data =>{
            const ipData = JSON.parse(data);
            var status = ipData.status;
            var cityN = ipData.city
            
            if(status  == 'fail'){
                cityN = 'Paris';
            }
            
            const cityName = cityN;
            const apiKey = process.env.API_KEY;
            const units = "imperial";
            const urlWeather = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',us&appid=' + apiKey + '&units=' + units;

            https.get(urlWeather, respon => {
                console.log(respon.statusCode);
                
                respon.on('data', data => {
                    const wData = JSON.parse(data);
                    var city = wData.name;
                    var cTemp = wData.main.temp;
                    var description = wData.weather[0].description;
                    var icon = wData.weather[0].icon;
                    var imgIcon = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                    res.render('home', {CR: copyright, cName: city, temp: cTemp, dWeather: description, imgIcon: imgIcon});
                });
            });
        });
    });
    
    
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
 