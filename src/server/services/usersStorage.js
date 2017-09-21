'use strict';

const bcrypt = require('bcrypt');
const Datastore = require('nedb');
const db = new Datastore({ filename : './data/users.db', autoload : true });

function insertTestData(doAfterInsert) {
    const users = [
        {email: 'max@mustermann.com', name: 'Max Mustermann', password: bcrypt.hashSync('max', 10), registration: new Date()},
        {email: 'jamesbond007@agent.com', name: 'James Bond', password: bcrypt.hashSync('james', 10), registration: new Date()}
    ];
    db.insert(users, (err, newDocs) => {
        if (doAfterInsert) {
            doAfterInsert(err, newDocs);
        }
    });
}

function getUsers(doAfterFind) {
    db.find({}, (err, users) => {
        if (doAfterFind) {
            doAfterFind(err, users);
        }
    });
}

function getUser(theUserId, doAfterFind) {
    db.findOne({ _id : theUserId }, (err, user) => {
        if (doAfterFind) {
            doAfterFind(err, user);
        }
    });
}

function login(theEmail, doAfterFind) {
    db.findOne({ email : theEmail }, (err, user) => {
        if (doAfterFind) {
            doAfterFind(err, user);
        }
    });
}

function createUser(theCredentials, doAfterInsert) {
    const user = {
        email: theCredentials.email,
        name: theCredentials.name,
        password: bcrypt.hashSync(theCredentials.password, 10),
        registration: new Date()
    };
    db.insert(user, (err, newDoc) => {
        if (doAfterInsert) {
            doAfterInsert(err, newDoc);
        }
    });
}

module.exports = {
    getUsers,
    getUser,
    login,
    createUser,
    insertTestData
};
