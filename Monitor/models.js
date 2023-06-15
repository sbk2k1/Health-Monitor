// models.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  url: String,
  requestType: String,
  payload: String,
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
  },
  threshold: Number,
  status: String,
  times: String,
  statusCode: String,
  responseSize: String,
  lastChecked: String,
});

const workspaceSchema = new mongoose.Schema({
  name: String,
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
const Request = mongoose.model('Request', requestSchema);

module.exports = { Workspace, Request };
