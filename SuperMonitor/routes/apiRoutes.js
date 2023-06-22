const Router = require('express').Router;
const router = Router();

const apiControllers = require('../controllers/apiControllers');

const {auth} = require('../middlewares/auth');

// worspace routes
// create workspace
// get all workspaces
// get workspace by name

// connection routes
// create connection
// get all connections


// workspace routes
router.get('/workspaces', auth,  apiControllers.getWorkspaces);
router.get('/workspaces/:name', auth,  apiControllers.getWorkspaceByName);
router.post('/workspaces', auth,  apiControllers.createWorkspace);

// connection routes
router.get('/connections/:workspace', auth,  apiControllers.getConnections);
router.post('/connections/:workspace',   apiControllers.createConnection);

module.exports = router;