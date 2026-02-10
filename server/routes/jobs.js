"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { requireAuth, requireEmployer, requireJobSeeker } = require('../middleware.js');
const { db } = require('../db.js');
const router = express.Router();
// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await db
            .selectFrom('jobs')
            .selectAll()
            .orderBy('posted_at', 'desc')
            .execute();
        res.json(jobs);
        return;
    }
    catch (error) {
        console.error('Failed to fetch jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
        return;
    }
});
// Get job by id
router.get('/:id', async (req, res) => {
    try {
        const job = await db
            .selectFrom('jobs')
            .selectAll()
            .where('id', '=', parseInt(Array.isArray(req.params.id) ? (req.params.id[0] || '0') : (req.params.id || '0')))
            .executeTakeFirst();
        if (!job) {
            res.status(404).json({ error: 'Job not found' });
            return;
        }
        res.json(job);
        return;
    }
    catch (error) {
        console.error('Failed to fetch job:', error);
        res.status(500).json({ error: 'Failed to fetch job' });
        return;
    }
});
// Create job (employer only)
router.post('/', requireAuth, requireEmployer, async (req, res) => {
    try {
        const { title, description, job_type, location, salary_min, salary_max, required_certifications } = req.body;
        if (!title || !description || !job_type || !location) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const employer = await db
            .selectFrom('employers')
            .selectAll()
            .where('user_id', '=', req.userId)
            .executeTakeFirst();
        if (!employer) {
            res.status(404).json({ error: 'Employer profile not found' });
            return;
        }
        const job = await db
            .insertInto('jobs')
            .values({
            employer_id: employer.id,
            title,
            description,
            job_type,
            location,
            salary_min: salary_min || null,
            salary_max: salary_max || null,
            required_certifications: required_certifications || null
        })
            .returningAll()
            .executeTakeFirstOrThrow();
        res.status(201).json(job);
        return;
    }
    catch (error) {
        console.error('Failed to create job:', error);
        res.status(500).json({ error: 'Failed to create job' });
        return;
    }
});
module.exports = router;
//# sourceMappingURL=jobs.js.map