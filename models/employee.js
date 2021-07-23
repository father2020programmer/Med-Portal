const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const employees = new mongoose.Schema({
    username: String,
    password: String,
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

employees.plugin(passportLocalMongoose);

module.exports = new mongoose.model('Employees', employees);