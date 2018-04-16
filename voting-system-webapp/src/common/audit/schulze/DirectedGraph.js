import React from 'react';

const buildGraph = (data, codes) => {
    if (!data || Object.keys(data).length === 0) {
        return '';
    }

    const nodes = Object.keys(data).reduce((output, key) => {
        const pair = data[key];
        if (!pair.win) {
            // did not win so it doesn't appear on the graph
            return output;
        }

        const start = codes[parseInt(pair.from, 10)];
        const end = codes[parseInt(pair.to, 10)];
        const item = `${start} -> ${end}[label=${pair.votes}]`;
        output.push(item);
        return output;
    }, []);
    return window.Viz(`
        digraph {
            bgcolor=transparent
            ${nodes.join('\n')}
        }
    `);
};

const DirectedGraph = (props) => (
    <div
        className="aafvs-audit__diagram"
        dangerouslySetInnerHTML={{__html: buildGraph(props.data, props.codes)}} />
);

export default DirectedGraph;
