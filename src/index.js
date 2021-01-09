import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom'

import App from "./App"
import Add from "./pages/add"

ReactDOM.render(
    <Router>
        <div>
            <main>
                <Route exact path="/" component={App} />
                <Route path="/add" component={Add} />
            </main>
        </div>
    </Router>, 
    document.getElementById("root")
    
)
