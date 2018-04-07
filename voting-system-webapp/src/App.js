import React from 'react';
import {
    HashRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import Axios from 'axios';

import AdminContainer from './admin/AdminContainer';
import VoteContainer from './vote/VoteContainer';
import CreateContainer from './create/CreateContainer';

import Header from './common/Header';

import './App.css';

Axios.defaults.baseURL = process.env.REACT_APP_API;

const App = () => (
    <Router>
        <div className="aafvs">
            <Header />
            <div className="aafvs__body">
                <Switch>
                    <Route path="/admin/:election" component={AdminContainer} />
                    <Route path="/vote/:election" component={VoteContainer} />
                    <Route component={CreateContainer} />
                </Switch>
            </div>
        </div>
    </Router>
);

export default App;
