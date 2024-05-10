import './env';

import { ErrorRequestHandler, Request, Response , NextFunction } from 'express';
import express from "express"
import routes from './api.routes';
import { initializeDatabase } from './util/data-source';
import { GasDemandEntity } from './entities/gasDemandEntity';


async function startServer() {
  try {
    await initializeDatabase();

    // Create an Express app
    const app = express();

    // Define routes
    app.use('/api/v1', routes);

    const port = process.env.port || 3001;

    // Error handling middleware
    app.use((err:ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
      console.error('Unhandled error:', err);
      res.status(500).send('Internal Server Error');
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  } catch (err) {
    console.error('Error initializing the database:', err);
  }
}

startServer();
