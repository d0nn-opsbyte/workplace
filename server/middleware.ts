const express = require('express');
const { getUserById } = require('./auth.js');
const session = require('express-session');

import type { Request, Response, NextFunction } from 'express';
import type { AuthUser } from './auth.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      userId?: number;
      session: any;
    }
  }
}

function sessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const userId = req.session?.userId;

  if (userId) {
    getUserById(userId).then((user: AuthUser | null) => {
      if (user) {
        req.user = user;
        req.userId = userId;
      }
      next();
    }).catch(() => next());
  } else {
    next();
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

function requireJobSeeker(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.user_type !== 'job_seeker') {
    res.status(403).json({ error: 'Job seeker access required' });
    return;
  }
  next();
}

function requireEmployer(req: Request, res: Response, next: NextFunction): void {
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
