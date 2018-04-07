import React from 'react';

const CreateListItem = (props) => {
    const clickedDelete = () => {
        props.removeItem(props.index);
    };

    return (
        <li
            className="aafvs-list__item">
            <div
                className="aafvs-list__value">
                {props.value}
            </div>
            <button
                className="aafvs-list__delete"
                onClick={clickedDelete}>
                Delete
            </button>
        </li>
    );
};

export default CreateListItem;
