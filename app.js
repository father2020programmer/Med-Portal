///////// Require Packages///////
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const https = require('https');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const pLocalMongoose = require('passport-local-mongoose');
const fetch = require('node-fetch');
const fs = require('./functions');
const schemas = require('./schemas');
const { json } = require('express');
const { Passport } = require('passport');
const rootPath = "../";


/////// App Configure /////// 
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//////Authentication////////
app.use(session({
    secret:"First full-stack project.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/////DataBase Config////
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://Randy_Wilkins:Test1234@cluster0.td7ri.mongodb.net/Med_Portal", {useNewUrlParser: true});
schemas.users.plugin(pLocalMongoose);

///// Set up Mongoose models/////
const MD_Location = new mongoose.model('MD_Location', schemas.locations);
const Patient = new mongoose.model('Patients', schemas.patients);
const Employee = new mongoose.model('Employees', schemas.employees);
const User = new mongoose.model('Users', schemas.users);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//// Main Paths/////
app.get('/', (req, res) => {
    const ipUrl = 'http://ip-api.com/json/';    
    
    fs.requestIP(ipUrl).then(data =>{
        const part ='hourly,alerts,minutely';
        const lat = data.lat;
        const lon = data.lon;
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
                todayT: Math.floor(todayW.temp),
                todayI: todayW.weather[0].icon,
                tomT: Math.floor(tomW.temp.day),
                tomI: tomW.weather[0].icon,
                next1T: Math.floor(n1Day.temp.day),
                next1I: n1Day.weather[0].icon,                
                next2T: Math.floor(n2Day.temp.day),
                next2I: n2Day.weather[0].icon,               
            });
        });
    });
    
});

app.get('/locations', (req, res) =>{    
    MD_Location.find({}, (err, foundLocations) => {
        res.render('locations', {CR: fs.getCopyRights(), medLoc: foundLocations});
    });    
});

app.get('/myChart', (req, res) => {
    res.render('myChart', {CR: fs.getCopyRights()});
});

app.get('/info', (req, res) => {
    res.render('subPage/info', { root: rootPath, CR: fs.getCopyRights()});
});

app.get('/patient', (req, res) =>{
    if(req.isAuthenticated()){
        res.render('patient/home', {root: rootPath, CR: fs.getCopyRights()});
    } else {
        res.redirect('/myChart');
    }   
    
});

///// Sub Paths /////
app.get('/register/:rigisterID', (req, res) => {
    let id = req.params.rigisterID;
    res.render('subPage/register', { root: rootPath, CR: fs.getCopyRights(), patientID: id});
});

app.get('/clinic/:clinicID', (req, res) => {
    const clinicId = req.params.clinicID;
    const arrayDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saterday'];

    MD_Location.find({_id: clinicId}, (err, clinics) =>{
        if(err){

            console.log(err);
        }else {

            res.render('subPage/clinic', {root: rootPath, CR: fs.getCopyRights(), clinic: clinics, day: arrayDays});
        }
    });

});




////////POST////////

app.post('/register', (req, res) => {
    let id = req.body.objID;

    User.register({username: req.body.userName}, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            res.redirect("/register" + id);
            alert('Sorry something went wrong.');
        }else{
            passport.authenticate('local')(req, res, () => {
                res.redirect("/patient");
            });
        }
    });
});

app.post('/info', (req, res) =>{
    let ssNum = req.body.ssn;
    let fName = req.body.firstName;
    let lName = req.body.lastName;
    let uEmail = req.body.email;
    let tel = req.body.phone;
    let str = req.body.address;
    let ci = req.body.city;
    let st = req.body.state;
    let z = req.body.zip;
    let en1 = req.body.eName1;
    let er1 = req.body.relation1;
    let ep1 = req.body.ePhone1;
    let en2 = req.body.eName2;
    let er2 = req.body.relation2;
    let ep2 = req.body.ePhone2; 

    let userInfo = new Patient({
        ssn: ssNum,
        firstName: fName,
        lastName: lName,
        contact: {
            address:{
                street: str,
                city: ci,
                state: st,
                zip: z
            },
            phone: tel,
            email: uEmail
        },
        emergency:[
            {
                name: en1,
                relation: er1,
                phone: ep1
            },
            {
                name: en2,
                relation: er2,
                phone: ep2
            }
        ]
    });

    userInfo.save(err => {        
        if(!err){
            let id = userInfo._id;
            res.redirect("/register/" + id);
        }
    });


});


///// App Server/////
app.listen(3000, () => {
    console.log("Server is Running");
});
 