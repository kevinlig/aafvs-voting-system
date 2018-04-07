import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import VoteBallotItem from './VoteBallotItem';

import './VoteBallot.css';

class VoteBallot extends React.Component {
    render() {
        const items = this.props.ballotOrder.map((id, index) => {
            const option = this.props.options[id];
            return (
                <VoteBallotItem
                    key={id}
                    id={id}
                    value={option}
                    index={index}
                    moveItemToPos={this.props.moveItemToPos} />
            )
        });
        return (
            <div className="aafvs-ballot">
                <ul
                    className="aafvs-ballot__list">
                    {items}
                </ul>
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(VoteBallot);
