import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { onGetData, isUser, onPostData } from "../../../api";
import "./sql.css";
const { useNotifications } = require("../../../context/NotificationContext");

export default function Sql() {
  const [logout, setLogout] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [page, setPage] = useState("select");
  const [name, setName] = useState("");
  const { createNotification } = useNotifications();

  useEffect(() => {
    if (!isUser()) {
      console.log("not logged in");
      setLogout(true);
    }
    getWorkspaces();
  }, []);

  const getWorkspaces = async () => {
    try {
      const res = await onGetData("sql/workspaces");
      if (res.status === 200) {
        if (res.data.length === 0) {
          createNotification("info", "You don't have any connections", "Info");
          setWorkspaces(null);
        } else {
          setWorkspaces(res.data);
          createNotification("success", "SQL Workspaces loaded", "Success");
        }
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      if (err.request) {
        createNotification("error", "Server is not responding", "Error");
      }
    }
  };

  if (logout) {
    return <Redirect to="/login" />;
  }

  const handleName = async (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await onPostData("sql/workspaces", {
      name: name,
    });

    if (data.error) {
      createNotification("error", data.error);
    } else {
      // reload
      window.location.reload();
    }
  };

  return (
    <div className="text-center">
      <h1>SQL Workspaces</h1>
      <br />
      <button
        onClick={() => setPage("create")}
        className={page === "create" ? "active-button" : ""}
      >
        Create a new workspace
      </button>
      <button
        onClick={() => setPage("select")}
        className={page === "select" ? "active-button" : ""}
      >
        Choose a workspace
      </button>

      {page === "select" && (
        <div className="choice">
          <br />
          <h3>Choose a workspace</h3>
          {!workspaces && (
            <>
              <br />
              <p>You don't have any workspaces</p>
            </>
          )}
          {workspaces &&
            workspaces.map((workspace) => (
              <Link to={`/dashboard/sql/${workspace.name}`}>
                <button id={workspace.name} key={workspace.name}>
                  {workspace.name}
                </button>
              </Link>
            ))}
        </div>
      )}

      {page === "create" && (
        <div className="text-center choice">
          <br />
          <h3>Create SQL Workspace</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter name"
              required
              onChange={handleName}
            />
            <button type="submit" className="form-button">
              Create Workspace
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
