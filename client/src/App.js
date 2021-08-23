import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
// import RtlLayout from "layouts/RTL.js";
import AdminLayout from "layouts/Admin.js";

import "assets/scss/material-dashboard-pro-react.scss?v=1.10.0";

function App() {
  const { id: userId } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <Switch>
        {/* <Route path="/rtl" component={RtlLayout} /> */}
        <Route path="/auth" component={AuthLayout} />
        {userId && <Route path="/admin" component={AdminLayout} />}
        {userId ? <Redirect to="/admin/dashboard" /> : <Redirect to="/auth" />}
        <Redirect to="/auth" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
