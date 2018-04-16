import React from 'react';

import WinEvent from './WinEvent';
import EliminateEvent from './EliminateEvent';

const Round = (props) => {
    let detail = null;
    if (props.event === 'transferWin') {
        detail = (
            <WinEvent
                {...props} />
        );
    }
    else if (props.event === 'transferEliminate') {
        detail = (
            <EliminateEvent
                {...props} />
        );
    }

    return (
        <div>
             <h4
                className="aafvs-audit__subtitle">
                Round {props.round}
            </h4>
            {detail}
        </div>
    );
};

export default Round;
