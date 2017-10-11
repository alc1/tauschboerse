'use strict';

const bcrypt = require('bcrypt');
const Datastore = require('nedb');
const db = new Datastore({ filename : './data/users.db', autoload : true });

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

function getUser(theUserId) {
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

function createUser(theCredentials) {
    const user = {
        email: theCredentials.email,
        name: theCredentials.name,
        password: bcrypt.hashSync(theCredentials.password, 10),
        registration: new Date()
    };
    return new Promise((resolve, reject) => {
        db.insert(user, (err, newDoc) => {
            storageUtils.handlePromiseResult(resolve, newDoc, reject, err);
        });
    });
}

module.exports = {
    getAllUsers,
    getUser,
    getUserByEmail,
    createUser,
    insertTestData
};
