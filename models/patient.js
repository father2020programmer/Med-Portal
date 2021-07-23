const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const patientInfo = new mongoose.Schema({
    username: String,
    password: String,
    accessCode: String,
    dateOfBirth: String,
    ssn: String,
    firstName: String,
    lastName: String,
    contact: {
        address: {
            street: String,
            city: String,
            state: String,
            zip: Number
        },
        phone: String,
        email: String,
    },
    emergency: [{
        name: String,
        relation: String,
        phone: String
    }],
    records: {
        drNotes: [{
            type: String,        
            date: String,
            notes: String,
        vitals: {
            bpm: Number,
            o2: Number,
            bp: String,
            hieght: String,
            wieght: String
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
        medications: [{
            type: String,
            quantity: Number,
            date: String
        }]}
});

patientInfo.plugin(passportLocalMongoose);

module.exports = mongoose.model('Patients', patientInfo);