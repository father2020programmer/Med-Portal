const express = require('express');
require('dotenv').config();
const date = new Date();

function todaysDate(){
    let today = date;
    let month = today.toLocaleString('default', {month: 'long'});
    let day = today.getDate();
    return {month, day};
}


module.exports = {todaysDate};