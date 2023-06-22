const express = require('express');
const router = express.Router();
const {WorkspaceSql} = require('../models/Workspace');
const {ConnectionSql} = require('../models/Connection');

// Add SQL endpoint routes here

// workspace routes
// get all workspaces
// get workspace by name
// create workspace

// connection routes
// get all connections

// workspace routes

const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await WorkspaceSql.find({user: req.user.username});
        res.status(200).json(workspaces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getWorkspaceByName = async (req, res) => {
    try {
        const workspace = await WorkspaceSql.findOne({ name: req.params.name, user: req.user.username });
        res.status(200).json(workspace);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createWorkspace = async (req, res) => {
    try{
    const workspace = new WorkspaceSql({
        name: req.body.name,
        user: req.user.username
    });
    const newWorkspace = await workspace.save();
    res.status(201).json(newWorkspace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// connection routes

const getConnections = async (req, res) => {
    try {
        var workspace = await WorkspaceSql.findOne({ name: req.params.workspace });
        var workspaceId = workspace._id;
        const connections = await ConnectionSql.find({ workspace: workspaceId});
        res.status(200).json(connections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createConnection = async (req, res) => {
    try{
        var workspace = await WorkspaceSql.findOne({ name: req.body.workspace });
        var workspaceId = workspace._id;
    const connection = new ConnectionSql({
        host: req.body.host,
        port: req.body.port,
        user: req.body.user,
        password: req.body.password,
        database: req.body.database,
        workspace: workspaceId,
        threshold: req.body.threshold,
        query: req.body.query
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
};
