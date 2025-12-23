import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname which is missing in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Handle SPA routing (redirect all other requests to index.html)
// using regex /.*/ to match all routes in Express v5
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});