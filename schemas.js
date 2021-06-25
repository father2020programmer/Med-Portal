const mongoose = require('mongoose');
const express = require('express');
const schema = mongoose.Schema;

const locations = schema({
    name: String,
    address: String,
    hours: Array,
    imgURL: String,
    mapURL: String,
    services: Array
}, {collection: 'MD_Location'});

const employees = schema({
    userName: { type: schema.Types.ObjectId, ref: 'User'},
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

const patients = schema({
    userName: { type: schema.Types.ObjectId, ref: 'User'},
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
    records: {
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
        }],
        medications: [{
            type: String,
            quantity: Number,
            date: String
        }]}
});

const users = schema({
    userName: String,
    password: String,
    userInfo: String,
});



module.exports = {locations, employees, patients, users};