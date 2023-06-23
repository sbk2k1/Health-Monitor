

import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { onGetData, isUser, onPostData } from "../../api";
import { useNotifications } from '../../context/NotificationContext';

// this gets all connections for a workspace
// the name of the workspace is passed in path params to the url
// make a get request to the api "api/connections/:workspace" to get all connections for a workspace
// display the connections in a list

export default function Sql(props) {
    const [logout, setLogout] = useState(false);
    const [connections, setConnections] = useState([]);
    // connection requires host, port, database, user, password, workspace (from page path params) and threshold (number) and query
    const [host, setHost] = useState("");
    const [port, setPort] = useState("");
    const [database, setDatabase] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [threshold, setThreshold] = useState(0);
    const [query, setQuery] = useState("");

    const { createNotification } = useNotifications();

    // page is either create or dashboard
    const [page, setPage] = useState("dashboard");


    useEffect(() => {
        if (!isUser()) {
            console.log("not logged in");
            setLogout(true);
        }
        getConnections();
    }, []);

    const getConnections = async () => {
        try {
            const res = await onGetData("sql/connections/" + props.match.params.name);
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

    const handleHost = async (e) => {
        e.preventDefault();
        setHost(e.target.value);
    }

    const handlePort = async (e) => {
        e.preventDefault();
        setPort(e.target.value);
    }

    const handleDatabase = async (e) => {
        e.preventDefault();
        setDatabase(e.target.value);
    }

    const handleUser = async (e) => {
        e.preventDefault();
        setUser(e.target.value);
    }

    const handlePassword = async (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const handleThreshold = async (e) => {
        e.preventDefault();
        setThreshold(e.target.value);
    }

    const handleQuery = async (e) => {
        e.preventDefault();
        setQuery(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            host: host,
            port: port,
            database: database,
            user: user,
            password: password,
            threshold: threshold,
            query: query
        }

        try {
            const res = await onPostData("sql/connections/" + props.match.params.name, data);
            if (res.status === 201) {
                window.location.reload();
            } else {
                createNotification("error", res.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="text-center">
            <h1>SQL Connections</h1>
            <button onClick={() => setPage("dashboard")}>Dashboard</button>
            <button onClick={() => setPage("create")}>Create Connection</button>

            {page === "dashboard" && (
                <>
                    <h3>Choose a connection</h3>
                    {connections.map((connection) => (
                        <h1>{connection.database}</h1>
                    ))}
                </>

            )}

            {page === "create" &&
                <>
                    <h3>Create a connection</h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Host:
                            <input type="text" name="host" onChange={handleHost} />
                        </label>
                        <label>
                            Port:
                            <input type="number" name="port" onChange={handlePort} />
                        </label>
                        <label>
                            Database:
                            <input type="text" name="database" onChange={handleDatabase} />
                        </label>
                        <label>
                            User:
                            <input type="text" name="user" onChange={handleUser} />
                        </label>
                        <label>
                            Password:
                            <input type="text" name="password" onChange={handlePassword} />
                        </label>
                        <label>
                            Query:
                            <input type="text" name="query" onChange={handleQuery} />
                        </label>
                        <label>
                            Threshold:
                            <input type="number" name="threshold" onChange={handleThreshold} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </>
            }
            </div>
    );
}
