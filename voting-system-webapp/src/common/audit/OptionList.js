import React from 'react';

const OptionList = (props) => {
     const ballotOptions = props.options.map((option, index) => (
        <li
            key={index}>
            <i><b>{props.codes[index] || ''}:</b></i>&nbsp;&nbsp;{option}
        </li>
    ));

    return (
        <ul
            className="aafvs-audit__option-list">
            {ballotOptions}
        </ul>
    );
};

export default OptionList;
