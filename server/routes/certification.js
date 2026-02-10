"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { requireAuth, requireJobSeeker } = require('../middleware.js');
const { db } = require('../db.js');
const router = express.Router();
router.get('/', requireAuth, requireJobSeeker, async (req, res) => {
    try {
        const jobSeeker = await db
            .selectFrom('job_seekers')
            .selectAll()
            .where('user_id', '=', req.userId)
            .executeTakeFirst();
        if (!jobSeeker) {
            res.status(404).json({ error: 'Job seeker profile not found' });
            return;
        }
        const certifications = await db
            .selectFrom('certifications')
            .selectAll()
            .where('job_seeker_id', '=', jobSeeker.id)
            .orderBy('issue_date', 'desc')
            .execute();
        res.json(certifications);
        return;
    }
    catch (error) {
        console.error('Failed to fetch certifications:', error);
        res.status(500).json({ error: 'Failed to fetch certifications' });
        return;
    }
});
router.post('/', requireAuth, requireJobSeeker, async (req, res) => {
    try {
        const { certification_name, issuing_body, issue_date, expiry_date, certification_number } = req.body;
        if (!certification_name || !issuing_body) {
            res.status(400).json({ error: 'Certification name and issuing body required' });
            return;
        }
        const jobSeeker = await db
            .selectFrom('job_seekers')
            .selectAll()
            .where('user_id', '=', req.userId)
            .executeTakeFirst();
        if (!jobSeeker) {
            res.status(404).json({ error: 'Job seeker profile not found' });
            return;
        }
        const certification = await db
            .insertInto('certifications')
            .values({
            job_seeker_id: jobSeeker.id,
            certification_name,
            issuing_body,
            issue_date: issue_date || null,
            expiry_date: expiry_date || null,
            certification_number: certification_number || null
        })
            .returningAll()
            .executeTakeFirstOrThrow();
        res.status(201).json(certification);
        return;
    }
    catch (error) {
        console.error('Failed to add certification:', error);
        res.status(500).json({ error: 'Failed to add certification' });
        return;
    }
});
router.delete('/:id', requireAuth, requireJobSeeker, async (req, res) => {
    try {
        const certId = parseInt(Array.isArray(req.params.id) ? (req.params.id[0] || '0') : (req.params.id || '0'));
        const jobSeeker = await db
            .selectFrom('job_seekers')
            .selectAll()
            .where('user_id', '=', req.userId)
            .executeTakeFirst();
        if (!jobSeeker) {
            res.status(404).json({ error: 'Job seeker profile not found' });
            return;
        }
        const certification = await db
            .selectFrom('certifications')
            .selectAll()
            .where('id', '=', certId)
            .executeTakeFirst();
        if (!certification || certification.job_seeker_id !== jobSeeker.id) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        await db
            .deleteFrom('certifications')
            .where('id', '=', certId)
            .execute();
        res.json({ message: 'Certification deleted' });
        return;
    }
    catch (error) {
        console.error('Failed to delete certification:', error);
        res.status(500).json({ error: 'Failed to delete certification' });
        return;
    }
});
module.exports = router;
//# sourceMappingURL=certification.js.map