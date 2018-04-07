import React from 'react';

import './AdminPage.css';

const AdminNotFound = () => (
    <div className="aafvs-admin">
        <h2
            className="aafvs-admin__title">
            Invalid Voting Session
        </h2>
        <p>
            No voting session exists at this URL.
        </p>
    </div>
);

export default AdminNotFound;
