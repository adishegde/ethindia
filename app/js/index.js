import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./containers/App";
import "semantic-ui-css/semantic.min.css";
import "../css/app.css";

render(
    <Router>
        <App />
    </Router>,
    document.getElementById("root")
);
