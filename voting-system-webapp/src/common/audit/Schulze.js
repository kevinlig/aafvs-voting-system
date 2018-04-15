import React from 'react';

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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

    createChart() {
        const nodes = Object.keys(this.state.pairwise).reduce((output, key) => {
            const pair = this.state.pairwise[key];
            if (!pair.win) {
                // did not win so it doesn't appear on the graph
                return output;
            }

            const start = this.state.codes[parseInt(pair.from, 10)];
            const end = this.state.codes[parseInt(pair.to, 10)];
            const item = `${start} -> ${end}[label=${pair.votes}]`;
            output.push(item);
            return output;
        }, []);
        return window.Viz(`
            digraph {
                ${nodes.join('\n')}
            }
        `);
    }

    render() {
        const ballotOptions = this.props.options.map((option, index) => (
            <li
                key={index}>
                <i><b>{this.state.codes[index] || ''}:</b></i>&nbsp;&nbsp;{option}
            </li>
        ));

        const pairwiseHeaders = this.state.codes.map((code) => (
            <th
                key={code}>
                x > {code}
            </th>
        ));

        const pairwiseRows = this.props.options.map((candidateValue, candidate) => {
            const rowHeader = (
                <th>
                    {this.state.codes[candidate]} > x
                </th>
            );

            const rowCells = this.props.options.map((opponentValue, opponent) => {
                // find the matchup in the pairwise audit
                const pair = this.state.pairwise[`${candidate}>${opponent}`];
                if (!pair) {
                    return (
                        <td
                            key={opponent}>
                            --
                        </td>
                    )
                }
                const winClass = pair.win ? 'aafvs-audit__win' : 'aafvs-audit__lose';
                return (
                    <td
                        className={winClass}
                        key={opponent}>
                        {pair.votes}
                    </td>
                );
            });

            return (
                <tr
                    key={candidate}>
                    {rowHeader}
                    {rowCells}
                </tr>
            );
        });

        const strengthRows = this.props.options.map((candidateValue, candidate) => {
            const rowHeader = (
                <th>
                    {this.state.codes[candidate]} > x
                </th>
            );

            const rowCells = this.props.options.map((opponentValue, opponent) => {
                // find the matchup in the pairwise audit
                const pair = this.state.paths[`${candidate}>${opponent}`];
                if (!pair) {
                    const value = opponent === candidate ? '--' : '';
                    return (
                        <td
                            key={opponent}>
                            {value}
                        </td>
                    )
                }
                return (
                    <td
                        key={opponent}>
                        {pair.strength}
                    </td>
                );
            });

            return (
                <tr
                    key={candidate}>
                    {rowHeader}
                    {rowCells}
                </tr>
            );
        });

        const rankRows = this.props.results.audit.ranking.map((rank) => {
            return (
                <tr
                    key={rank.candidate}>
                    <td>
                        {this.state.codes[parseInt(rank.candidate, 10)]}
                    </td>
                    <td>
                        {rank.value}
                    </td>
                </tr>
            );
        });

        return (
            <div className="aafvs-audit__breakdown">
                <h4
                    className="aafvs-audit__subtitle">
                    Ballot Options
                </h4>
                <p className="aafvs-audit__paragraph">
                    The audit steps below will use these codes to represent the options that were available on the ballot:
                </p>
                <ul
                    className="aafvs-audit__option-list">
                    {ballotOptions}
                </ul>
                <h4
                    className="aafvs-audit__subtitle">
                    Pairwise Matrix
                </h4>
                <p className="aafvs-audit__paragraph">
                    Every possible pair of ballot item matches are calculated and run against each other based on voter preferences.
                </p>
                <table
                    className="aafvs-audit__pairwise">
                    <thead>
                        <tr>
                            <td />
                            {pairwiseHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        {pairwiseRows}
                    </tbody>
                </table>
                <br />
                <h4
                    className="aafvs-audit__subtitle">
                    Pairwise Preference Paths
                </h4>
                <p className="aafvs-audit__paragraph">
                    A directed graph is created depicting the winning pairwise matches. This graph allows the system to determine direct and indirect preferences between any two ballot items.
                </p>
                <div
                    className="aafvs-audit__diagram"
                    dangerouslySetInnerHTML={{__html: this.createChart()}} />
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
                <table
                    className="aafvs-audit__pairwise">
                    <thead>
                        <tr>
                            <td />
                            {pairwiseHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        {strengthRows}
                    </tbody>
                </table>
                <br />
                 <h4
                    className="aafvs-audit__subtitle">
                    Ranking
                </h4>
                <p className="aafvs-audit__paragraph">
                    Ballot items are ranked based on the sum of direct paths that originate from them combined with the strengths of paths that indirectly originate from the given item (paths that continue on from directly connected items). Taking indirect paths into account allows highly preferred items to be rewarded.
                </p>
                <table
                    className="aafvs-audit__pairwise">
                    <thead>
                        <tr>
                            <th>
                                Ballot Item
                            </th>
                            <th>
                                Total Strength
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankRows}
                    </tbody>
                </table>
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