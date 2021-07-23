///////// Require Packages///////
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const fetch = require('node-fetch');

////// Required Paths////
const rootPath = "../";
const fs = require('./functions');
const MD_Location = require('./models/clinics');
const Employee = require('./models/employee');
const Patient = require('./models/patient');
const patient = require('./models/patient');

/////// App Configure /////// 
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//////Authentication////////
app.use(passport.initialize());
app.use(session({
    secret:"First full-stack project.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.session());

/////DataBase Config////
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://Randy_Wilkins:Test1234@cluster0.td7ri.mongodb.net/Med_Portal", {useNewUrlParser: true});

/////Set Passport/////
passport.use(Patient.createStrategy());
passport.serializeUser((patient, done) =>{
    done(null, patient.id);
});
passport.deserializeUser((id, done) => {
    Patient.findById(id, (err, patient) => {
        done(err, patient);
    })
});


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

app.get('/checkaccess', (req, res) => {
    res.render('subPage/checkaccess', { root: rootPath, CR: fs.getCopyRights()});
});

app.get('/patient', (req, res) =>{
    res.render('patient/home', { root: rootPath, CR: fs.getCopyRights()});   
    
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
    let patientID = req.body.objID;

    Patient.register(({username: req.body.username}), req.body.password, (err, u) =>{
        if(err){
            console.log(err);
        }

        Patient.findByIdAndUpdate({username: req.body.username}, (err, patient) => {
            if(err){
                console.log(err);
            }

            passport.authenticate('local')(req,res, () =>{
                res.redirect('patient');
            });

        });
        
    });

    
     
});

app.post('/checkaccess', (req, res) =>{ 
    let month = req.body.month;
    let day = req.body.day;
    let year = req.body.year;   
    let s1 = req.body.ssn1;
    let s2 = req.body.ssn2;
    let s3 = req.body.ssn3;    
    let c1 = req.body.code1;
    let c2 = req.body.code2;

    let dob = month + '/' + day + '/' + year;
    let ssn = s1 + '-' + s2 + '-' + s3;
    let code = c1 + '-' + c2;

    Patient.find({ssn: ssn}, (err, p) => {
        if(p[0].dateOfBirth == dob && p[0].accessCode == code){
            res.redirect('/register/' + p[0]._id);
        } else{
            console.log(err);            
            res.redirect('/myChart');
        }
    });
});


///// App Server/////
app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });
 