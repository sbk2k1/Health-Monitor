const Router = require('express').Router;
const router = Router();

const sqlControllers = require('../controllers/sqlControllers');

// worspace routes
// create workspace
// get all workspaces
// get workspace by name

// connection routes
// create connection
// get all connections

// workspace routes
router.get('/workspaces', sqlControllers.getWorkspaces);
router.get('/workspaces/:name', sqlControllers.getWorkspaceByName);
router.post('/workspaces', sqlControllers.createWorkspace);

// connection routes
router.get('/connections', sqlControllers.getConnections);
router.post('/connections', sqlControllers.createConnection);

module.exports = router;