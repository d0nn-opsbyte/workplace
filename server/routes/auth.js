"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { registerUser, loginUser } = require('../auth');
const router = express.Router();
router.post('/register', async (req, res) => {
    try {
        const { email, password, full_name, user_type, company_name } = req.body;
        if (!email || !password || !full_name || !user_type) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const user = await registerUser(email, password, full_name, user_type, { company_name });
        req.session.userId = user.id;
        res.status(201).json(user);
        return;
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: 'Registration failed' });
        return;
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }
        const user = await loginUser(email, password);
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        req.session.userId = user.id;
        res.json(user);
        return;
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
        return;
    }
});
router.post('/logout', (req, res) => {
    req.session?.destroy(() => {
        res.json({ message: 'Logged out' });
    });
    return;
});
router.get('/me', (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    res.json(req.user);
    return;
});
module.exports = router;
//# sourceMappingURL=auth.js.map