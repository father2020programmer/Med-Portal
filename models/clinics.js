const mongoose = require('mongoose');
const express = require('express');


const locations = new mongoose.Schema({
    name: String,
    address: String,
    hours: Array,
    imgURL: String,
    mapURL: String,
    services: Array
}, {collection: 'MD_Location'});


module.exports = mongoose.model('MD_Location', locations);