'use strict';

const bcrypt = require('bcrypt');
const Datastore = require('nedb');
const dataFiles = require('./dataFiles');

const db = dataFiles.dbUsers;

const storageUtils = require('../utils/storageUtils');

function insertTestData() {
    const users = [
        {email: 'max@mustermann.com', name: 'Max Mustermann', password: bcrypt.hashSync('max', 10), registration: new Date()},
        {email: 'jamesbond007@agent.com', name: 'James Bond', password: bcrypt.hashSync('james', 10), registration: new Date()}
    ];
    return new Promise((resolve, reject) => {
        db.insert(users, (err, newDocs) => {
            storageUtils.handlePromiseResult(resolve, newDocs, reject, err);
        });
    });
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.find({}, (err, users) => {
            storageUtils.handlePromiseResult(resolve, users, reject, err);
        });
    });
}

function getUserById(theUserId) {
    return new Promise((resolve, reject) => {
        db.findOne({ _id : theUserId }, (err, user) => {
            storageUtils.handlePromiseResult(resolve, user, reject, err);
        });
    });
}

function getUserByEmail(theEmail) {
    return new Promise((resolve, reject) => {
        db.findOne({ email : theEmail }, (err, user) => {
            storageUtils.handlePromiseResult(resolve, user, reject, err);
        });
    });
}

function createUser(theUser) {
    const user = {
        email: theUser.email,
        name: theUser.name,
        password: bcrypt.hashSync(theUser.newPassword, 10),
        registration: new Date()
    };
    return new Promise((resolve, reject) => {
        db.insert(user, (err, newDoc) => {
            storageUtils.handlePromiseResult(resolve, newDoc, reject, err);
        });
    });
}

function updateUser(theUserId, theUserDetails) {
    return new Promise((resolve, reject) => {
        db.update({ _id: theUserId }, { $set: theUserDetails }, {}, (err, numAffected) => {
            storageUtils.handlePromiseResult(resolve, numAffected, reject, err);
        });
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    insertTestData
};
