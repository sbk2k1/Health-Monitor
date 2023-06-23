import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import loadable from "@loadable/component";

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/about" component={loadable(() => import("./pages/about/about"))} />
          <Route exact path="/login" component={loadable(() => import("./pages/login/login"))} />
          <Route exact path="/register" component={loadable(() => import("./pages/register/register"))} />
          <Route exact path="/workspaces/api" component={loadable(() => import("./pages/workspace/api/api"))} />
          <Route exact path="/workspaces/sql" component={loadable(() => import("./pages/workspace/sql/sql"))} />
          <Route exact path="/workspaces" component={loadable(() => import("./pages/workspace/select/select"))} />
          <Route exact path="/dashboard/api/:name" component={loadable(() => import("./pages/dashboard/api"))} />
          <Route exact path="/dashboard/sql/:name" component={loadable(() => import("./pages/dashboard/sql"))} /> 
          <Route exact path="/" component={loadable(() => import("./pages/home/home"))} />
          <Route component={loadable(() => import("./pages/404"))} />
        </Switch>
      </div>
      {/* <NotificationContainer /> */}
    </Router>
  );
}
