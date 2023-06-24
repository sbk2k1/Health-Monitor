const express = require('express');
const { WorkspaceApi } = require('../models/Workspace');
const { ConnectionApi } = require('../models/Connection');

// Add API Controllers here

// workspace controllers
// get all workspaces
// get workspace by name
// create workspace

// connection controllers
// get all connections
// create connection

// workspace controllers

const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await WorkspaceApi.find({user: req.user.username});
        res.status(200).json(workspaces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getWorkspaceByName = async (req, res) => {
    try {
        const workspace = await WorkspaceApi.findOne({ name: req.params.name, user: req.user.username });
        res.status(200).json(workspace);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createWorkspace = async (req, res) => {
    try {
        const workspace = new WorkspaceApi({
            name: req.body.name,
            user: req.user.username
        });
        const newWorkspace = await workspace.save();
        res.status(201).json(newWorkspace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// connection controllers

const getConnections = async (req, res) => {
    // path params
    try {
        var workspace = await WorkspaceApi.findOne({ name: req.params.workspace });
        var workspaceId = workspace._id;
        const connections = await ConnectionApi.find({ workspace: workspaceId});
        res.status(200).json(connections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createConnection = async (req, res) => {
    try {

        // take care of %20 in workspace name
        var workspace = req.params.workspace;

        workspace = await WorkspaceApi.findOne({ name: workspace });
        var workspaceId = workspace._id;
        const connection = new ConnectionApi({
            url: req.body.url,
            requestType: req.body.requestType,
            workspace: workspaceId,
            threshold: Number(req.body.threshold),
        });
        const newConnection = await connection.save();
        res.status(201).json(newConnection);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};





module.exports = {
    getWorkspaces,
    getWorkspaceByName,
    createWorkspace,
    getConnections,
    createConnection
}
