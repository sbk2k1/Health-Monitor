// app.js
const express = require('express');
const axios = require('axios');
const { Workspace, Request } = require('./models');
const schedule = require('node-schedule');

// database connection
require('./db');

const app = express();
app.use(express.json());

axios.interceptors.request.use( x => {
  // to avoid overwriting if another interceptor
  // already defined the same object (meta)
  x.meta = x.meta || {}
  x.meta.requestStartedAt = new Date().getTime();
  return x;
})

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
      threshold: req.body.threshold
    });

    workspace.requests.push(request._id);
    await workspace.save();

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add request' });
  }
});

// Get the dashboard for a workspace
app.get('/workspaces/:workspaceId/dashboard', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId).populate('requests');

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const dashboard = workspace.requests.map((request) => ({
      url: request.url,
      requestType: request.requestType,
      payload: request.payload,
      status: request.status,
      threshold: request.threshold,
    }));

    res.status(200).json(dashboard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
});

// Schedule request sending every 10 seconds

schedule.scheduleJob('*/10 * * * * *', async () => {
  const workspaces = await Workspace.find().populate('requests');

  workspaces.forEach(async (workspace) => {
    workspace.requests.forEach(async (request) => {
      try {
        // the request object is passed to axios
        
        const response = await axios({
          method: request.requestType,
          url: request.url,
          data: request.payload,
          //threshold: request.threshold,
        });


        // get response time using axios interceptors
        const responseTime = new Date().getTime() - response.config.meta.requestStartedAt;


        
        if(responseTime > request.threshold) {
          request.status = 'Slow';
        }
        else{
        request.status = 'Healthy';
        }

        // response.headers['x-response-time'];
        var time;


        // check if request.time.split(',').length is equal to 10
        if ( request.times == undefined ) {
          time = responseTime;
        } 
        // when there is not , in the times
        else if (request.times.split(',').length < 10) {
          // add error to the end of the array
          time = request.times + ',' + responseTime;
        }
        // when there is , in the times
        else {
          // if equal to 10, remove the first element of the array and add the new response time to the end of the array
          const times = request.times.split(',');
          times.shift();
          times.push(responseTime);
          time = times.join(',');
        }

        request.times = time;

        // add other data to the request object
        request.statusCode = response.status;
        request.responseSize = response.headers['content-length'];
        request.lastChecked = new Date().toISOString();


        await request.save();
      } catch (error) {
        console.log(error.message);
        request.status = 'Down';
        var time;
        if ( request.times == undefined ) {
          time = "error";
        } 
        // when there is not , in the times
        else if (request.times.split(',').length < 10) {
          // add error to the end of the array
          // console.log(request.times);
          time = request.times + ',' + "error";
          // console.log(time);
        }
        // when there is , in the times
        else {
          // if equal to 10, remove the first element of the array and add the new response time to the end of the array
          const times = request.times.split(',');
          times.shift();
          times.push("error");
          time = times.join(',');
        }

        // console.log(time);
        request.times = time;
        
        request.statusCode = "Error";
        request.responseSize = "Error";
        request.lastChecked = new Date().toISOString();

        await request.save();
      }
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
