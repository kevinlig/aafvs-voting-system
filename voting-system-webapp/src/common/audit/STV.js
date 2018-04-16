import React from 'react';

import { alphabet } from './alphabet';
import OptionList from './OptionList';
import Round from './stv/Round';

export default class STV extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            codes: [],
            pairwise: {},
            paths: {}
        };
    }

    componentDidMount() {
        this.prepareData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            this.prepareData();
        }
    }

    prepareCodes() {
        return this.props.options.map((option, index) => (
            alphabet[index % 26]
        ));
    }

    

    prepareData() {
        const codes = this.prepareCodes();

        this.setState({
            codes: codes
        });
    }

    render() {
        const rounds = this.props.results.audit.map((round, index) => (
            <Round
                {...round}
                key={index}
                round={index + 1}
                quota={this.props.results.quota}
                codes={this.state.codes}
                isLast={index + 1 >= this.props.results.audit.length} />
        ));

        return (
            <div className="aafvs-audit__breakdown">
                <h4
                    className="aafvs-audit__subtitle">
                    Ballot Options
                </h4>
                <p className="aafvs-audit__paragraph">
                    The audit steps below will use these codes to represent the options that were available on the ballot:
                </p>
                <OptionList
                    codes={this.state.codes}
                    options={this.props.options} />
                <h4
                    className="aafvs-audit__subtitle">
                    Win Quota
                </h4>
                <p className="aafvs-audit__paragraph">
                    The Droop quota is used to determine the number of votes a ballot item requires to win. In this voting session, the win quota is <b>{this.props.results.quota}</b>.
                </p>

                {rounds}

                <p className="aafvs-audit__paragraph">
                    In this voting session, the RVH ballot was submitted by voter <b>{this.props.results.rvh.id.substring(this.props.results.rvh.id.length - 5)}</b>.
                </p>
            </div>
        );
    }
}