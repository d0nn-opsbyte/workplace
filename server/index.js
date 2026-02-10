"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const { setupStaticServing } = require('./static-serve.js');
const { sessionMiddleware } = require('./middleware.js');
const authRoutes = require('./routes/auth.js');
const jobRoutes = require('./routes/jobs.js');
const applicationRoutes = require('./routes/applications.js');
const certificationRoutes = require('./routes/certifications.js');
dotenv.config();
const app = express();
// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));
// Custom session middleware
app.use(sessionMiddleware);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/certifications', certificationRoutes);
// Export a function to start the server
async function startServer(port) {
    try {
        if (process.env.NODE_ENV === 'production') {
            setupStaticServing(app);
        }
        app.listen(port, () => {
            console.log(`API Server running on port ${port}`);
        });
    }
    catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}
// Start the server directly if this is the main module
if (require.main === module) {
    console.log('Starting server...');
    startServer(process.env.PORT || 3001);
}
module.exports = { startServer };
//# sourceMappingURL=index.js.map