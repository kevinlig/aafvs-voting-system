import React from 'react';

import CreateList from './CreateList';

import './CreatePage.css';

export default class CreatePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            count: 3,
            options: [],
            isValid: false
        };

        this.submitForm = this.submitForm.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateCount = this.updateCount.bind(this);

        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    submitForm() {
        if (!this.state.isValid) {
            // invalid form
            return;
        }

        const submission = {
            title: this.state.title,
            count: parseInt(this.state.count, 10),
            options: this.state.options
        };

        this.props.submitForm(submission);
    }

    updateTitle(e) {
        this.setState({
            title: e.target.value
        }, () => {
            this.runValidation();
        });
    }

    updateCount(e) {
        const proposed = e.target.value;
        if (!isNaN(parseInt(proposed, 10)) || proposed === '') {
            this.setState({
                count: e.target.value
            }, () => {
                this.runValidation();
            });
        }
    }

    addItem(value) {
        const newOptions = [].concat(this.state.options);
        newOptions.push(value);

        this.setState({
            options: newOptions
        }, () => {
            this.runValidation();
        });
    }

    removeItem(index) {
        if (index >= this.state.options.length) {
            return;
        }
        const newOptions = [].concat(this.state.options);
        newOptions.splice(index, 1);

        this.setState({
            options: newOptions
        }, () => {
            this.runValidation();
        });
    }

    validateForm() {
        if (!this.state.title) {
            return false;
        }
        if (!this.state.count || this.state.count < 1 || this.state.count > this.state.options.length) {
            return false;
        }
        if (this.state.options.length === 0) {
            return false;
        }

        return true;
    }

    runValidation() {
        this.setState({
            isValid: this.validateForm()
        });
    }

    render() {
        return (
            <div className="aafvs-create">
                <h2
                    className="aafvs-create__title">
                    Create a New Voting Session
                </h2>
                <div
                    className="aafvs-create__form aafvs-form">
                    <div
                        className="aafvs-form__group">
                        <label
                            className="aafvs-form__label"
                            htmlFor="aafvs-form__title">
                            Session Name
                        </label>
                        <input
                            id="aafvs-form__title"
                            className="aafvs-form__input"
                            type="text"
                            placeholder="Session Name"
                            value={this.state.title}
                            onChange={this.updateTitle} />
                    </div>

                    <div
                        className="aafvs-form__group">
                        <label
                            className="aafvs-form__label"
                            htmlFor="aafvs-form__count">
                            Number of Winners
                        </label>
                        <input
                            id="aafvs-form__count"
                            className="aafvs-form__input"
                            type="text"
                            value={this.state.count}
                            onChange={this.updateCount} />
                    </div>

                    <div
                        className="aavfs-form__group">
                        <CreateList
                            data={this.state.options}
                            addItem={this.addItem}
                            removeItem={this.removeItem} />
                    </div>

                    <button
                        className="aafvs-form__submit aafvs__button"
                        disabled={!this.state.isValid || this.props.inFlight}
                        onClick={this.submitForm}>
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}
