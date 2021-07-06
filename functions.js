const express = require('express');
require('dotenv').config();
const fetch = require('node-fetch');
const date = new Date();

function requestIP(url){
    return fetch(url)
    .then(r => r.json())
    .then(json => json);
} 

function todaysDate(){
    let today = date;
    let month = today.getMonth()
    let day = today.getDate();
    return {month, day};
}

function getCopyRights(){
    const copyright = new Date().getFullYear()
    return copyright;
}


module.exports = {todaysDate, getCopyRights, requestIP};