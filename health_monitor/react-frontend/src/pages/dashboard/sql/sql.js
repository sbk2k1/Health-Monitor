import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { onGetData, isUser, onPostData } from "../../../api";
import { useNotifications } from "../../../context/NotificationContext";
import "./sql.css";
import { Line } from "react-chartjs-2";
import { Dna } from "react-loader-spinner";

export default function Api(props) {
  const [logout, setLogout] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [connections, setConnections] = useState([]);
  const [host, setHost] = useState("");
  const [database, setDatabase] = useState("");
  const [port, setPort] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState(null);
  const [page, setPage] = useState("dashboard");

  // loader
  const [loading, setLoading] = useState(true);

  // useref hook for current active connection
  const active = useRef(null);

  const { createNotification } = useNotifications();

  useEffect(() => {
    if (!isUser()) {
      console.log("not logged in");
      setLogout(true);
    }
    getConnections();

    const interval = setInterval(() => {
      getConnections();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getConnections = async () => {
    try {
      const res = await onGetData("sql/connections/" + props.match.params.name);

      // here active state is reset to null on each interval because of the way useEffect works
      // to prevent this, we can use a useRef hook

      if (res.status === 200) {
        if (res.data.length === 0) {
          setConnections(null);
        } else {
          setConnections(res.data);
        }
        if (active.current === null) {
          active.current = res.data[0];
        } else {
          // if active connection is not null, check if it is in the new connections array
          // if it is, set active to that connection
          // else set active to the first connection in the array
          if (
            res.data.some((connection) => connection.database === active.current.database && connection.host === active.current.host && connection.port === active.current.port && connection.query === active.current.query)
          ) {
            active.current = res.data.find(
              (connection) => connection.database === active.current.database && connection.host === active.current.host && connection.port === active.current.port && connection.query === active.current.query,
            );
          } else {
            active.current = res.data[0];
          }
        }
        setLoading(false);
      } else {
        createNotification("error", res.data);
      }
    } catch (err) {
      if (
        err.response &&
        err.response.data.message ==
          "Cannot read properties of null (reading '_id')"
      ) {
        createNotification("error", "No Such Workspace Found", "Error");
        setRedirect("/workspaces/sql");
      } else if (err.request) {
        createNotification("error", "Server is not responding", "Error");
      }
    }
  };

  if (logout) {
    return <Redirect to="/login" />;
  }

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  const handHost = (e) => {
    e.preventDefault();
    setHost(e.target.value);
  };

  const handleDatabase = (e) => {
    e.preventDefault();
    setDatabase(e.target.value);
  };

  const handlePort = (e) => {
    e.preventDefault();
    setPort(e.target.value);
  };

  const handleUser = (e) => {
    e.preventDefault();
    setUser(e.target.value);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleQuery = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const handleThreshold = (e) => {
    e.preventDefault();
    setThreshold(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await onPostData(
        "sql/connections/" + props.match.params.name,
        {
          host,
          database,
          port,
          user,
          password,
          query,
          threshold,
        },
      );

      if (res.status === 201) {
        window.location.reload();
      } else {
        createNotification("error", res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleConnection = (event, connection) => {
    active.current = connection;
    // search for button with both active-button and connection-button classes
    // remove active-button class from that button
    if(document.getElementsByClassName("active-button connection-button")[0]){
      document
        .getElementsByClassName("active-button connection-button")[0]
        .classList.remove("active-button");
      }

    // add active-button class to clicked button
    event.target.classList.add("active-button");
  };

  return (
    <div className="text-center">
      <h1>SQL Connections</h1>

      <button
        onClick={() => {
          setPage("dashboard");
        }}
        className={page === "dashboard" ? "active-button" : ""}
      >
        Dashboard
      </button>
      <button
        onClick={() => {
          setPage("create");
        }}
        className={page === "create" ? "active-button" : ""}
      >
        Create Connection
      </button>

      {page === "dashboard" && (
        <div className="choice">
          <h3>Choose a connection</h3>

          {loading && (
            <Dna
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
              className="connections"
            />
          )}

          {!loading && !connections && (
            <>
              <br />
              <p>No Connection in Workspace</p>
            </>
          )}

          {!loading && (
            <div className="connections">
              <div className="connection">
                {connections &&
                  connections.map((connection, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        handleConnection(e, connection);
                      }}
                      // make first button active by default
                      className={
                        index === 0
                          ? "active-button connection-button"
                          : "connection-button"
                      }
                    >
                      {connection.database}
                    </button>
                  ))}
              </div>
              {active.current && (
                <div className="data">
                  <div className="graph">
                    {active.current.times && (
                      <Line
                        data={{
                          labels: [
                            "T-9",
                            "T-8",
                            "T-7",
                            "T-6",
                            "T-5",
                            "T-4",
                            "T-3",
                            "T-2",
                            "T-1",
                            "0",
                          ],
                          datasets: [
                            {
                              label: active.current.url,
                              data: active.current.times
                                .split(",")
                                .map((time) => parseInt(time)),
                              fill: false,
                              backgroundColor: "rgb(0, 99, 132)",
                              borderColor: "rgba(0, 99, 132, 0.2)",
                            },
                            // straight line at threshold
                            {
                              label: "Threshold",
                              data: Array(10).fill(active.current.threshold),
                              fill: false,
                              backgroundColor: "rgb(255, 0, 132)",
                              borderColor: "rgba(255, 0, 132, 1)",
                              // make threshold line dashed
                              borderDash: [5, 5],
                              //remove point on threshold line
                              pointRadius: 0,
                            },
                          ],
                        }}
                        options={{
                          scales: {
                            y: {
                              beginAtZero: true,
                              // y goes from 0 to 1500
                              max: active.current.threshold * 4,
                            },
                          },
                        }}
                      />
                    )}

                    {!active.current.times && (
                      <p className="graph">No Connection Established</p>
                    )}
                  </div>
                  <div className="details">
                    <h3>Graph For</h3>
                    <br />
                    <p>Host: {active.current.host}</p>
                    <p>Database: {active.current.database}</p>
                    <p>Port: {active.current.port}</p>
                    <p>Query: {active.current.query}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {page === "create" && (
        <div className="choice">
          <h3>Create Connection</h3>
          <form onSubmit={handleSubmit}>
            
            {/* we need host, database, port, user, password and query and threshold for sql */}

            <input
              type="text"
              id="host"
              name="host"
              placeholder="Enter Host"
              onChange={handHost}
              required
              className="form-input"
            />

            <input
              type="text"
              id="database"
              name="database"
              placeholder="Enter Database"
              onChange={handleDatabase}
              required
              className="form-input"
            />
            <input
              type="text"
              id="port"
              name="port"
              placeholder="Enter Port"
              onChange={handlePort}
              required
              className="form-input"
            />

            <input
              type="text"
              id="user"
              name="user"
              placeholder="Enter User"
              onChange={handleUser}
              required
              className="form-input"
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              onChange={handlePassword}
              required
              className="form-input"
            />

            <input
              type="text"
              id="query"
              name="query"
              placeholder="Enter Query"
              onChange={handleQuery}
              required
              className="form-input"
            />

            <input
              type="text"
              id="threshold"
              name="threshold"
              placeholder="Enter Threshold"
              onChange={handleThreshold}
              required
              className="form-input"
            />

            <input type="submit" value="Submit" className="form-button" />
          </form>
        </div>
      )}
    </div>
  );
}
