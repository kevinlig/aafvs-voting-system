import React from 'react';

import './Share.css';

const Share = (props) => {
    const currentUrl = window.location.href;
    const rootUrl = currentUrl.substring(0, currentUrl.indexOf('#'));

    const clickedClose = () => {
        props.closeElection(props.election.id);
    }

    return (
        <div className="aafvs-admin__share">
            Share this link with your participants:<br />
            <a
                className="aafvs-admin__share-link"
                target="_blank"
                rel="noopener noreferrer"
                href={`#/vote/${props.election.id}`}>
                {`${rootUrl}#/vote/${props.election.id}`}
            </a>
            <div className="aafvs-admin__close">
                <p className="aafvs-admin__close-instructions">
                    Click the button to stop accepting votes and to count the results.
                </p>
                <button
                    className="aafvs-admin__close-button"
                    onClick={clickedClose}
                    disabled={props.closeInFlight}>
                    End Voting
                </button>
            </div>
        </div>
    );
}

export default Share;
