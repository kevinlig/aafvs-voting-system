import React from 'react';
import { alphabet } from './alphabet';

import OptionList from './OptionList';
import PairwiseMatrix from './schulze/PairwiseMatrix';
import DirectedGraph from './schulze/DirectedGraph';
import StrengthRank from './schulze/StrengthRank';

export default class Schulze extends React.Component {
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

    preparePairwise() {
        // convert the pairwise audit array into a dictionary for fast lookups
        return this.props.results.audit.pairwise.reduce((parsed, pair) => {
            return Object.assign({}, parsed, {
                [`${pair.from}>${pair.to}`]: pair
            });
        }, {});
    }

    preparePaths() {
        return this.props.results.audit.strongestPaths.reduce((parsed, pair) => {
            return Object.assign({}, parsed, {
                [`${pair.from}>${pair.to}`]: pair
            });
        }, {});
    }

    prepareData() {
        const codes = this.prepareCodes();
        const pairwise = this.preparePairwise();
        const paths = this.preparePaths();

        this.setState({
            codes: codes,
            pairwise: pairwise,
            paths: paths
        });
    }

    render() {
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
                    Pairwise Matrix
                </h4>
                <p className="aafvs-audit__paragraph">
                    Every possible pair of ballot item matches are calculated and run against each other based on voter preferences. Matches highlighted in green indicate &quot;winning matches&quot; &mdash; when given two specific items, more voters preferred the first item over the second than the second item over the first.
                </p>
                <PairwiseMatrix
                    options={this.state.codes}
                    data={this.state.pairwise}
                    valueKey="votes"
                    highlightWins />
                <br />
                <h4
                    className="aafvs-audit__subtitle">
                    Pairwise Preference Paths
                </h4>
                <p className="aafvs-audit__paragraph">
                    A directed graph is created depicting the winning pairwise matches. This graph allows the system to determine direct and indirect preferences between any two ballot items.
                </p>
                <DirectedGraph
                    data={this.state.pairwise}
                    codes={this.state.codes} />
                <br />
                <h4
                    className="aafvs-audit__subtitle">
                    Strongest Paths
                </h4>
                <p className="aafvs-audit__paragraph">
                    The Schulze method determines its rankings based on the strongest path to the other ballot items. The strength value of a path is equal to the <i>lowest</i> pairwise value that is contained within the path. This means that that strongest path may not be a direct path between the two ballot items.
                </p>
                <p className="aafvs-audit__paragraph">
                    The strongest paths for only winning pairwise matches are shown in the table below.
                </p>
                <PairwiseMatrix
                    options={this.state.codes}
                    data={this.state.paths}
                    valueKey="strength" />
                <br />
                 <h4
                    className="aafvs-audit__subtitle">
                    Ranking
                </h4>
                <p className="aafvs-audit__paragraph">
                    Ballot items are ranked based on the sum of direct paths that originate from them combined with the strengths of paths that indirectly originate from the given item (paths that continue on from directly connected items). Taking indirect paths into account allows highly preferred items to be rewarded.
                </p>
                <StrengthRank
                    data={this.props.results.audit.ranking}
                    codes={this.state.codes} />
                <p className="aafvs-audit__paragraph">
                    When multiple ballot items have the same total strength, they will be retained as long as there are unfilled winner slots. However, if there are insufficient winner slots to account for all tied ballot items, the tied items will be ranked among themselves using Random Voter Hierarchy (RVH). The tied items will fill the winnner slots until there are no more slots available in the preference order of the RVH ballot.
                </p>
                <p className="aafvs-audit__paragraph">
                    In this voting session, the RVH ballot was submitted by voter <b>{this.props.results.rvh.id.substring(this.props.results.rvh.id.length - 5)}</b>.
                </p>
            </div>
        );
    }
}
