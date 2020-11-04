import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
import Admin from '../Admin';

const Routing = (
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/admin" component={Admin} />
    </div>
  </Router>
);

export default Routing;
