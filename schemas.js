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

const users = new mongoose.Schema({
    username: String,
    password: String,
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient'},
    docID: {type: mongoose.Schema.Types.ObjectId, ref: 'Employee'}
});

const patients = new mongoose.Schema({
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

module.exports = {locations, employees, patients, users};