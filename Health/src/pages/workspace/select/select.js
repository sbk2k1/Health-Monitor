import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./select.css";

export default function Select() {
  const [redirect, setRedirect] = useState(null);

  const handleApi = async (e) => {
    e.preventDefault();
    setRedirect(0);
  };

  const handleSql = async (e) => {
    e.preventDefault();
    setRedirect(1);
  };

  if (redirect === 0) {
    return <Redirect to="/workspaces/api" />;
  }

  if (redirect === 1) {
    return <Redirect to="/workspaces/sql" />;
  }

  return (
    <div className="select-container">
      <h1>Select Workspace</h1>
      <br />
      <div className="pricing-wrapper">
        <div className="pricing-option">
          <h2>API Workspace</h2>
          <p>Work with APIs efficiently</p>
          <button onClick={handleApi}>Select</button>
        </div>
        <div className="pricing-option">
          <h2>SQL Workspace</h2>
          <p>Manage SQL databases effortlessly</p>
          <button onClick={handleSql}>Select</button>
        </div>
      </div>
    </div>
  );
}
