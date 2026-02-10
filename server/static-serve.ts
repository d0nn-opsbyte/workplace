const path = require('path');
const express = require('express');
import type { Request, Response, NextFunction } from 'express';

/**
 * Sets up static file serving for the Express app
 * @param app Express application instance
 */
function setupStaticServing(app: any) {
  // Serve static files from the public directory
  app.use(express.static(path.join(process.cwd(), 'public')));

  // For any other routes, serve the index.html file
  app.get('/{*splat}', (req: Request, res: Response, next: NextFunction) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });
}

module.exports = { setupStaticServing };
