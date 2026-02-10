const express = require('express');
const { requireAuth, requireJobSeeker, requireEmployer } = require('../middleware.js');
const { db } = require('../db.js');

import type { Request, Response } from 'express';

const router = express.Router();

// Apply to job (job seeker only)
router.post('/', requireAuth, requireJobSeeker, async (req: Request, res: Response): Promise<void> => {
  try {
    const { job_id } = req.body;

    if (!job_id) {
      res.status(400).json({ error: 'Job ID required' });
      return;
    }

    const jobSeeker = await db
      .selectFrom('job_seekers')
      .selectAll()
      .where('user_id', '=', req.userId!)
      .executeTakeFirst();

    if (!jobSeeker) {
      res.status(404).json({ error: 'Job seeker profile not found' });
      return;
    }

    const application = await db
      .insertInto('applications')
      .values({
        job_id,
        job_seeker_id: jobSeeker.id,
        status: 'pending'
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    res.status(201).json(application);
    return;
  } catch (error: any) {
    console.error('Failed to apply:', error);
    if (error.message?.includes('UNIQUE')) {
      res.status(400).json({ error: 'Already applied to this job' });
      return;
    }
    res.status(500).json({ error: 'Failed to apply' });
    return;
  }
});

// Get applications for job seeker
router.get('/seeker', requireAuth, requireJobSeeker, async (req: Request, res: Response): Promise<void> => {
  try {
    const jobSeeker = await db
      .selectFrom('job_seekers')
      .selectAll()
      .where('user_id', '=', req.userId!)
      .executeTakeFirst();

    if (!jobSeeker) {
      res.status(404).json({ error: 'Job seeker profile not found' });
      return;
    }

    const applications = await db
      .selectFrom('applications')
      .innerJoin('jobs', 'applications.job_id', 'jobs.id')
      .select(['applications.id', 'applications.status', 'applications.applied_at', 'jobs.title', 'jobs.location'])
      .where('applications.job_seeker_id', '=', jobSeeker.id)
      .orderBy('applications.applied_at', 'desc')
      .execute();

    res.json(applications);
    return;
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
    return;
  }
});

// Get applications for job (employer only)
router.get('/job/:jobId', requireAuth, requireEmployer, async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = parseInt(Array.isArray(req.params.jobId) ? (req.params.jobId[0] || '0') : (req.params.jobId || '0'));

    const job = await db
      .selectFrom('jobs')
      .selectAll()
      .where('id', '=', jobId)
      .executeTakeFirst();

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    const employer = await db
      .selectFrom('employers')
      .selectAll()
      .where('user_id', '=', req.userId!)
      .executeTakeFirst();

    if (!employer || job.employer_id !== employer.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const applications = await db
      .selectFrom('applications')
      .innerJoin('job_seekers', 'applications.job_seeker_id', 'job_seekers.id')
      .innerJoin('users', 'job_seekers.user_id', 'users.id')
      .select(['applications.id', 'applications.status', 'applications.applied_at', 'users.full_name', 'users.email'])
      .where('applications.job_id', '=', jobId)
      .orderBy('applications.applied_at', 'desc')
      .execute();

    res.json(applications);
    return;
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
    return;
  }
});

module.exports = router;
