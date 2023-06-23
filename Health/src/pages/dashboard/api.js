

import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { onGetData, isUser, onPostData } from "../../api";
import {useNotifications} from '../../context/NotificationContext';

// this gets all connections for a workspace
// the name of the workspace is passed in path params to the url
// make a get request to the api "api/connections/:workspace" to get all connections for a workspace
// display the connections in a list

export default function Api(props) {
    const [logout, setLogout] = useState(false);
    const [connections, setConnections] = useState([]);
    // connection requires url, requestType, workspace (from page path params) and threshold (number)
    const [url, setUrl] = useState("");
    const [method, setMethod] = useState("");
    const [threshold, setThreshold] = useState(0);
    // page is either create or dashboard
    const [page, setPage] = useState("dashboard");

    const { createNotification } = useNotifications();

    useEffect(() => {
        if(!isUser()) {
            console.log("not logged in");
            setLogout(true);
        }
        getConnections();
    }, []);

    const getConnections = async () => {
        try {
            const res = await onGetData("api/connections/" + props.match.params.name);
            if (res.status === 200) {
                setConnections(res.data);
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (logout) {
        return <Redirect to="/login" />;
    }

    const handleUrl = async (e) => {
        e.preventDefault();
        setUrl(e.target.value);
    }

    const handleMethod = async (e) => {
        e.preventDefault();
        setMethod(e.target.value);
    }

    const handleThreshold = async (e) => {
        e.preventDefault();
        setThreshold(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await onPostData("api/connections/" + props.match.params.name, {
                url: url,
                requestType: method,
                threshold: threshold
            });

            if (res.status === 201) {
                window.location.reload();
            } else {
                // alert(res.data.message);
                createNotification("error", res.data);
            }   

        } catch (err) {
            console.log(err);
        }
    }
                

    return (
        <div className="text-center">
            <h1>API Connections</h1>

            <button onClick={() => setPage("dashboard")}>Dashboard</button>
            <button onClick={() => setPage("create")}>Create Connection</button>

            {page === "dashboard" &&
            <>
            <h3>Choose a connection</h3>
            {connections.map((connection) => (
                <h1>{connection.url}</h1>
            ))}
            </> }

            {page === "create" &&
            <>
            <h1>Create Connection</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Url:
                    <input type="text" value={url} onChange={handleUrl} />
                </label>
                {/* Method is either GET, POST, PUT or DELTE */}
                <select id="method" class="form-input" required onChange={handleMethod}>
                    <option value="" disabled selected>Select Method</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
                <label>
                    Threshold:
                    <input type="number" value={threshold} onChange={handleThreshold} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            </> }

        </div>
    );
}

    