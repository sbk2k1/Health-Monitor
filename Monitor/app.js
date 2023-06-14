// app.js
const express = require('express');
const axios = require('axios');
const { Workspace, Request } = require('./models');
const schedule = require('node-schedule');

// database connection
require('./db');

const app = express();
app.use(express.json());

// Create a new workspace
app.post('/workspaces', async (req, res) => {
  try {
    const workspace = await Workspace.create({ name: req.body.name });
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create workspace' });
  }
});

// Add a request to a workspace
app.post('/workspaces/:workspaceId/requests', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const request = await Request.create({
      url: req.body.url,
      requestType: req.body.requestType,
      payload: req.body.payload,
      workspace: workspace._id,
      status: 'Unknown',
    });

    workspace.requests.push(request._id);
    await workspace.save();

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add request' });
  }
});

// Get the dashboard
app.get('/dashboard', async (req, res) => {
  try {
    const workspaces = await Workspace.find().populate('requests');
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Schedule request sending every 5 minutes
schedule.scheduleJob('*/5 * * * *', async () => {
  const workspaces = await Workspace.find().populate('requests');

  workspaces.forEach(async (workspace) => {
    workspace.requests.forEach(async (request) => {
      try {
        const response = await axios({
          method: request.requestType,
          url: request.url,
          data: request.payload,
        });

        request.status = 'Healthy';
        await request.save();
      } catch (error) {
        request.status = 'Down';
        await request.save();
      }
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
