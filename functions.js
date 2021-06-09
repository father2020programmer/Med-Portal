const { json, raw } = require('body-parser');
const { error } = require('console');
const { promises } = require('dns');
const https = require('https');
const fetch = require('node-fetch');
const { resourceUsage } = require('process');
const superagent = require('superagent');
require('dotenv').config();


const ipApiKey = process.env.IP_API_KEY;
const ipUrl = 'https://api.ipgeolocation.io/ipgeo?apiKey=' + ipApiKey;

const cityName = '';
const apiKey = process.env.API_KEY;
const units = "imperial";
const urlWeather = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',us&appid=' + apiKey + '&units=' + units;

function getRawData(){
    const https = require('https');
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

async function getIPAddress(){
    let data = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=' + ipApiKey)
    .then(res => res.json())
    .then(res => {return res});

    return data;
}

module.exports = {getIp};
