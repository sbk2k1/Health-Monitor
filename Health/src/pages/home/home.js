import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./home.css";

export default function Home() {
    const [redirect, setRedirect] = useState(false);

    if (redirect) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="home">
            <header className="header">
                <h1>Server and SQL Health Monitoring</h1>
                <nav>
                    <button onClick={() => setRedirect(true)}>Login</button>
                </nav>
            </header>
            <section className="banner">
                <h2>Welcome to our Monitoring Website!</h2>
                <p>Keep track of your servers and SQL databases in real-time.</p>
            </section>
            <section className="features">
                <h2>Features</h2>
                <ul>
                    <li>Real-time server health monitoring</li>
                    <li>SQL database performance metrics</li>
                    <li>Alerts and notifications</li>
                    <li>Data visualization and analytics</li>
                </ul>
            </section>
        </div>
    );
}
