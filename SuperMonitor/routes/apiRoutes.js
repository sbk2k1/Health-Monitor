const Router = require('express').Router;
const router = Router();

const apiControllers = require('../controllers/apiControllers');

// worspace routes
// create workspace
// get all workspaces
// get workspace by name

// connection routes
// create connection
// get all connections


// workspace routes
router.get('/workspaces', apiControllers.getWorkspaces);
router.get('/workspaces/:name', apiControllers.getWorkspaceByName);
router.post('/workspaces', apiControllers.createWorkspace);

// connection routes
router.get('/connections', apiControllers.getConnections);
router.post('/connections', apiControllers.createConnection);

module.exports = router;