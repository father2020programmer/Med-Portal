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
    address: {
        street: String,
        city: String,
        state: String,
        zip: Number
    },
    position: {
        title: String,
        certification: [{
            cirtificate: String,
            date: String
        }]
    },
    password: String,
    ssn: String,
    management: Boolean
});

const patients = schema({
    userID: { type: schema.Types.ObjectId, ref: 'User'},
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

const users = schema({
    userName: String,
    password: String,
    userInfo: String
});



module.exports = {locations, employees, patients, users};