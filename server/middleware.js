"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { getUserById } = require('./auth.js');
const session = require('express-session');
function sessionMiddleware(req, res, next) {
    const userId = req.session?.userId;
    if (userId) {
        getUserById(userId).then((user) => {
            if (user) {
                req.user = user;
                req.userId = userId;
            }
            next();
        }).catch(() => next());
    }
    else {
        next();
    }
}
function requireAuth(req, res, next) {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
}
function requireJobSeeker(req, res, next) {
    if (!req.user || req.user.user_type !== 'job_seeker') {
        res.status(403).json({ error: 'Job seeker access required' });
        return;
    }
    next();
}
function requireEmployer(req, res, next) {
    if (!req.user || req.user.user_type !== 'employer') {
        res.status(403).json({ error: 'Employer access required' });
        return;
    }
    next();
}
module.exports = {
    sessionMiddleware,
    requireAuth,
    requireJobSeeker,
    requireEmployer,
};
//# sourceMappingURL=middleware.js.map