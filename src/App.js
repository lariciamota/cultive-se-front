import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Charts from "./components/Charts";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Charts} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
