import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getProjectsReport } from './src/models/projects.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * View Engine Setup
 */
// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */
app.get('/', (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();

        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error('Failed to load organizations:', error);
        res.status(500).send('Unable to load organizations at this time.');
    }
});

app.get('/projects', async (req, res) => {
    try {
        const report = await getProjectsReport();
        console.log('projects report:', report);

        const title = 'Projects';
        res.render('projects', { title, report });
    } catch (error) {
        console.error('Failed to load projects:', error);
        res.status(500).send('Unable to load projects at this time.');
    }
});
app.get('/categories',(req,res ) =>{
    const title = 'Categories';
    res.render('categories', {title});
});


/**
 * Start Server
 */
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});