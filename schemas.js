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

const employees = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    position: {
        title: String,
        certification: [{
            cirtificate: String,
            date: String
        }]
    },
    password: String,
    ssn: String
});

const record = new mongoose.Schema({
    drNotes: [{
        date: String,
        notes: String,
        vitals: {
            bpm: Number,
            o2: Number,
            bp: String
        }
    }],
    techNotes: [{
        type: String,
        date: String,
        notes: String,
        image: {
            data: Buffer,
            contentType: String
        }
    }],
    labs: [{
        type: String,
        date: String,
        results: String
    }],
    specilty:[{
        type: String,
        doctor:{
            name: String,
            notes: String
        },
        date: String,
    }]
}),

const patients = new mongoose.Schema({
    ssn: String,
    name: String,
    contact: {
        address: String,
        phone: {
            main: String,
            second: String
        },
        email: String,
    },
    emergency: [{
        name: String,
        relation: String,
        phone: String
    }],
    records: record,
    medications: [{
        type: String,
        quantity: Number,
        date: String
    }]
});



module.exports = {locations, employees, patients};