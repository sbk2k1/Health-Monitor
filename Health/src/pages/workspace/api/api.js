import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { onGetData, onPostData, isUser } from "../../../api";
import "./api.css";
const { useNotifications } = require("../../../context/NotificationContext");

export default function Api() {
  const [redirect, setRedirect] = useState(null);
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
      const res = await onGetData("api/workspaces");
      if (res.status === 200) {
        setWorkspaces(res.data);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleWorkspace = async (e) => {
    e.preventDefault();
    setRedirect(e.target.id);
  };

  if (redirect) {
    return <Redirect to={"/dashboard/api/" + redirect} />;
  }

  if (logout) {
    return <Redirect to="/login" />;
  }

  const handleName = async (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await onPostData("api/workspaces", {
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
      <h1>API Workspaces</h1>
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
          {workspaces.map((workspace) => (
            <button
              id={workspace.name}
              onClick={handleWorkspace}
              key={workspace.name}
            >
              {workspace.name}
            </button>
          ))}
        </div>
      )}

      {page === "create" && (
        <div className="text-center choice">
          <br />
          <h3>Create API Workspace</h3>
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
