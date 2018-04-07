import React from 'react';
import CreateListItem from './CreateListItem';
import './CreateList.css';

export default class CreateList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: ''
        };

        this.updateInput = this.updateInput.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    updateInput(e) {
        this.setState({
            input: e.target.value
        });
    }

    addItem(e) {
        e.preventDefault();
        this.props.addItem(this.state.input);
        this.setState({
            input: ''
        });
    }

    render() {
        const items = this.props.data.map((item, i) => (
            <CreateListItem
                key={i}
                value={item}
                index={i}
                removeItem={this.props.removeItem} />
        ));

        return (
            <div className="aafvs-list">
                <h3
                    className="aafvs-list__title">
                    Ballot Items
                </h3>
                <form
                    className="aafvs-list__editor"
                    onSubmit={this.addItem}>
                    <label
                        className="aafvs-list__editor-label"
                        htmlFor="aafvs-list__editor-input">
                        Ballot Item
                    </label>
                    <div className="aafvs-list__editor-group">
                        <input
                            id="aafvs-list__editor-input"
                            className="aafvs-list__editor-input"
                            type="text"
                            placeholder="Ballot item"
                            value={this.state.input}
                            onChange={this.updateInput} />
                        <input
                            type="submit"
                            className="aafvs-list__editor-submit aafvs__button aafvs__button_secondary"
                            value="Add Item"
                            disabled={!this.state.input} />
                    </div>
                </form>
                <ul
                    className="aafvs-list__list">
                    {items}
                </ul>
            </div>
        );
    }
}