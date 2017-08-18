'use strict';

const Datastore = require('nedb');
const db = new Datastore({ filename : './data/users.db', autoload : true });

function insertTestData(doAfterInsert) {
    const users = [
        {email: 'max@mustermann.com', name: 'Max Mustermann', password: 'max', address: 'Strasse 1\nPLZ Wohnort', registration: new Date()},
        {email: 'jamesbond007@agent.com', name: 'James Bond', password: 'james', address: 'Strasse 2\nPLZ Wohnort', registration: new Date()}
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

module.exports = {
    getUsers,
    getUser,
    insertTestData
};
