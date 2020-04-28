/**
 * @file
 * Main express setup.
 */

import express from 'express';
import CONFIG from './config';
const app = express();

app.disable('x-powered-by');
app.use(express.static('dist'));

/**
 * Start express application.
 */
app.listen(CONFIG.port, () => {
  console.log(`server running on port ${CONFIG.port}`);
});
