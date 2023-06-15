// app.js
const express = require('express');
const axios = require('axios');
const { Workspace, Request } = require('./models');
const schedule = require('node-schedule');

// database connection
require('./db');

const app = express();
app.use(express.json());

axios.interceptors.request.use(x => {
  // to avoid overwriting if another interceptor
  // already defined the same object (meta)
  x.meta = x.meta || {}
  x.meta.requestStartedAt = new Date().getTime();
  return x;
})

// ...

// Route 1: Create new workspaces and select workspace (Homepage)
app.get('/', async (req, res) => {
  try {
    const workspaces = await Workspace.find();
    res.send(`
    <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
  
    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
  
    form {
      margin-bottom: 20px;
    }
  
    label {
      display: block;
      margin-bottom: 5px;
    }
  
    input[type="text"] {
      width: 100%;
      padding: 5px;
      margin-bottom: 10px;
    }
  
    button[type="submit"] {
      background-color: #4caf50;
      color: white;
      border: none;
      padding: 8px 16px;
      cursor: pointer;
    }
  
    button[type="submit"]:hover {
      background-color: #45a049;
    }
  
    ul {
      list-style-type: none;
      padding: 0;
    }
  
    li {
      margin-bottom: 10px;
    }
  
    li a {
      color: #000;
      text-decoration: none;
      font-weight: bold;
    }
  
    li a:hover {
      color: #4caf50;
    }
  </style>
  
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <h1>Create New Workspace</h1>
  <form id="createWorkspaceForm">
    <label for="name">Workspace Name:</label>
    <input type="text" name="name" id="name" required>
    <button type="submit">Create</button>
  </form>
  <h1>Select Workspace</h1>
  <ul>
    ${workspaces
      .map(
        (workspace) =>
          `<li><a href="/workspaces/${workspace._id}/manage">${workspace.name}</a></li>`
      )
      .join('')}
  </ul>
  <script>
    $(function () {
      $('#createWorkspaceForm').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission
        const name = $('#name').val(); // Get the value of the name input field
        console.log(name);
        $.ajax({
          type: 'POST',
          // Send the request to the /workspaces route of your server
          url: '/workspaces',
          data: JSON.stringify({ name: name }), // Convert data to JSON string
          contentType: 'application/json',
          success: function () {
            // Handle success if needed
            console.log('Workspace created successfully');
            // refresh the page
            location.reload();
          },
          error: function (err) {
            // Handle error if needed
            console.log(err);
          },
        });
      });
    });
  </script>
  
    `);
  } catch (err) {
    res.status(500).send(err.message);
  }
});



// Route 2: Workspace dashboard with request data and adding new data
app.get('/workspaces/:workspaceId/manage', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId).populate('requests');

    if (!workspace) {
      return res.status(404).send('Workspace not found');
    }

    res.send(`
    <style>
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  form {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input[type="text"],
  textarea,
  select {
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
  }

  button[type="submit"] {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
  }

  button[type="submit"]:hover {
    background-color: #45a049;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 15px;
    border: 1px solid #ccc;
    padding: 10px;
  }
</style>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<h1>${workspace.name} Dashboard</h1>
<form id="addRequestForm">
  <label for="url">URL:</label>
  <input type="text" name="url" id="url" required><br>
  <label for="requestType">Request Type:</label>
  <select name="requestType" id="requestType" required>
    <option value="GET">GET</option>
    <option value="POST">POST</option>
    <option value="PUT">PUT</option>
    <option value="DELETE">DELETE</option>
  </select><br>
  <label for="payload">Payload:</label>
  <textarea name="payload" id="payload"></textarea><br>
  <label for="threshold">Threshold:</label>
  <input type="number" name="threshold" id="threshold" required><br>
  <button type="submit">Add Request</button>
</form>
<h2>Requests:</h2>
<ul>
  ${workspace.requests
    .map(
      (request) => `
    <li>
      <strong>URL:</strong> ${request.url}<br>
      <strong>Request Type:</strong> ${request.requestType}<br>
      <strong>Payload:</strong> ${request.payload}<br>
      <strong>Status:</strong> ${request.status}<br>
      <strong>Threshold:</strong> ${request.threshold}<br>
      <strong>Response Time:</strong> ${request.times}<br>
      <strong>Status Code:</strong> ${request.statusCode}<br>
      <strong>Response Size:</strong> ${request.responseSize}<br>
      <strong>Last Checked:</strong> ${request.lastChecked}<br>
    </li>
  `
    )
    .join('')}
</ul>
<script>
  $(function () {
    $('#addRequestForm').submit(function (event) {
      event.preventDefault(); // Prevent the default form submission
      const requestData = {
        url: $('#url').val(),
        requestType: $('#requestType').val(),
        payload: $('#payload').val(),
        threshold: $('#threshold').val(),
      };
      console.log(requestData);
      $.ajax({
        type: 'POST',
        url: '/workspaces/${workspace._id}/requests',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function () {
          // Handle success if needed
          console.log('Request added successfully');
          // refresh the page
          location.reload();
        },
        error: function (err) {
          // Handle error if needed
          console.log(err);
        },
      });
    });
  });
</script>

    `);
  } catch (err) {
    res.status(500).send('Failed to load workspace dashboard');
  }
});


// ...


// Create a new workspace
app.post('/workspaces', async (req, res) => {
  try {
    const workspace = await Workspace.create({ name: req.body.name });
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ body: req.body });
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
      times: request.times,
      statusCode: request.statusCode,
      responseSize: request.responseSize,
      lastChecked: request.lastChecked,
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



        if (responseTime > request.threshold) {
          request.status = 'Slow';
        }
        else {
          request.status = 'Healthy';
        }

        // response.headers['x-response-time'];
        var time;


        // check if request.time.split(',').length is equal to 10
        if (request.times == undefined) {
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

        console.log(Object.keys(response.data));

        request.statusCode = response.output;
        request.responseSize = response.data.length;
        request.lastChecked = new Date().toISOString();


        await request.save();
      } catch (error) {
        console.log(error.message);
        request.status = 'Down';
        var time;
        if (request.times == undefined) {
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
