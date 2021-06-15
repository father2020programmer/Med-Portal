const https = require('https');
const fetch = require('node-fetch');
const express = require('express');
const { get } = require('http');
const { model } = require('mongoose');
const { json } = require('body-parser');
require('dotenv').config();


const ipApiKey = process.env.IP_API_KEY;
const ipUrl = 'https://api.ipgeolocation.io/ipgeo?apiKey=' + ipApiKey;

// const apiKey = process.env.WEATHER_API_KEY;
// const units = "imperial";
// const urlWeather = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',us&appid=' + apiKey + '&units=' + units;

function requestIP(url){
    return fetch(url)
    .then(r => r.json())
    .then(json => (json.city));
}

function getWetData(){
    requestIP(ipUrl).then(data =>{
        const apiKey = process.env.WEATHER_API_KEY;
        const units = "imperial";
        const urlWeather = 'https://api.openweathermap.org/data/2.5/weather?q=' + data + ',us&appid=' + apiKey + '&units=' + units;

        fetch(urlWeather)
        .then(r => r.json())
        .then(json =>{
            document.getElementById('cityName').nodeValue = json.name;
        })

    })
}

module.exports = {getWetData};