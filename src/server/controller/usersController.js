'use strict';

const usersStore = require('../services/usersStorage');

function getUsers(req, res) {
    usersStore.getUsers((err, users) => {
        res.json({ users : users || [] });
    });
}

function getUser(req, res) {
    const userId = req.params.userId;
    usersStore.getUser(userId, (err, user) => {
        res.json({ user : user || {} });
    });
}

module.exports = {
    getUsers,
    getUser
};
