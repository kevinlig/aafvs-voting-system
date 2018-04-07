import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';

const type = 'BALLOT_ITEM';

const source = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
            value: props.value
        };
    }
};

const collect = function(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
};

const spec = {
    drop(props, monitor, component) {
        component.props.moveItemToPos(monitor.getItem().id, props.index);
    }
};

const dropCollect = function(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
};

class VoteBallotItem extends React.Component {
    render() {
        const movingClass = this.props.isDragging ? 'aafvs-ballot__list-item_moving' : '';
        return this.props.connectDragSource(
            this.props.connectDropTarget(
                <li
                    className={`aafvs-ballot__list-item ${movingClass}`}>
                    {this.props.value}
                </li>
            )
        );
    }
}

export default DragSource(type, source, collect)(DropTarget(type, spec, dropCollect)(VoteBallotItem));
