function convertBallot(arr) {
    // convert the array into an object where the voted index is the key and the preference is the value
    return arr.reduce((parsed, item, index) => {
        return Object.assign({}, parsed, {
            [item]: index
        });
    }, {});
}

function prepareBallots(raw) {
    // pick a ballot for RVH tiebreaking
    const rvhIndex = Math.floor(Math.random() * Object.keys(raw).length);
    let rvhId = Object.keys(raw)[rvhIndex];
    let rvhBallot;

    // convert each ballot to an object with the count for each index
    const ballots = Object.keys(raw).reduce((parsed, key, index) => {
        const convertedBallot = convertBallot(raw[key]);
        parsed.push(convertedBallot);
        if (index === rvhIndex) {
            rvhBallot = convertedBallot;
        }
        return parsed;
    }, []);

    return {
        votes: ballots,
        rvh: {
            id: rvhId,
            ballot: rvhBallot
        }
    }
}

function generatePairs(candidates) {
    return candidates.reduce((pairs, candidate) => {
        const candidatePairs = candidates.reduce((currentPairs, opponent) => {
            if (opponent !== candidate) {
                return currentPairs.concat([[candidate, opponent]]);
            }
            return currentPairs;
        }, []);
        return pairs.concat(candidatePairs);
    }, []);
}

function votesForXY(votes, x, y) {
    return votes.reduce((result, vote) => {
        return Object.assign({}, result, {
            // lower index values mean higher priority
            x: vote[x] <= vote[y] ? result.x + 1 : result.x,
            y: vote[y] <= vote[x] ? result.y + 1 : result.y
        });
    }, {
        x: 0,
        y: 0
    });
}

function calculatePairMatrix(pairs, votes) {
    return pairs.reduce((matrix, pair) => {
        const candidate = pair[0];
        const opponent = pair[1];

        const pairVotes = votesForXY(votes, candidate, opponent);
        
        return Object.assign({}, matrix, {
            [pair.join('>')]: {
                from: candidate,
                to: opponent,
                votes: pairVotes.x,
                win: pairVotes.x > pairVotes.y
            }
        });
    }, {});
}

function calculateAllPaths(matrix, candidates, x, y, visited = []) {
    // calculate all paths going from X to Y
    return candidates.reduce((validPaths, candidate) => {
        if (candidate === x) {
            // end is the same as start, so do nothing
            return validPaths;
        }

        const link = matrix[`${x}>${candidate}`];
        if (link.votes === 0 || !link.win) {
            // no one voted for X over Y, so do nothing
            // alternatively, someone voted, but it lost, so it cannot have a directed path
            return validPaths;
        }

        const visitedNode = visited.some((node) => node.from === candidate);
        // if this destination is already visited, drop it otherwise we will have a loop
        if (visitedNode) {
            return validPaths;
        }

        // create the path
        const path = {
            from: x,
            to: candidate,
            strength: link.votes
        };

        // update the visit history with this most recent link
        const updatedVisited = visited.concat([path]);

        if (candidate === y) {
            // we've reached the target destination
            // add it to the paths list
            validPaths.push(updatedVisited);
            return validPaths;
        }

        // otherwise, we need to keep going
        const completedPaths = calculateAllPaths(matrix, candidates, candidate, y, updatedVisited);

        // when the recursion finishes, we'll have an array of paths from x to y, so merge them with
        // any other paths we've already calculated
        return validPaths.concat(completedPaths);
    }, []);
}

function calculateStrongestPath(matrix, candidates, x, y) {
    // first we need all the paths between X and Y
    // also determine their weakest link value
    const allPaths = calculateAllPaths(matrix, candidates, x, y);
    if (allPaths.length === 0) {
        return null;
    }

    const pathValues = allPaths.map((path) => {
        const weakestLink = path.reduce((min, link) => {
            if (link.strength < min) {
                // weaker link, update
                return link.strength;
            }
            return min;
        }, path[0].strength);

        // the strength of the whole path is the strength of the weakest link
        return {
            path: path,
            strength: weakestLink
        }
    });

    // return just the strongest path
    return pathValues.sort((path1, path2) => path2.strength - path1.strength)[0];
}

function calculateMatrixStrength(matrix, candidates) {
    return Object.keys(matrix).reduce((output, key) => {
        const pair = matrix[key];
        const path = calculateStrongestPath(matrix, candidates, pair.from, pair.to);
        if (!path) {
            // no possible path
            return output;
        }

        return Object.assign({}, output, {
            [key]: {
                from: pair.from,
                to: pair.to,
                path: path.path,
                strength: path.strength
            }
        });
    }, {});
}

function traverseIndirectComparisons(ranks, currentKey, sum, visited = []) {
    const current = ranks[currentKey];
    if (current.indirect.length === 0) {
        return sum;
    }

    return current.indirect.reduce((sum, indirect) => {
        // check if we've already visited this item
        if (visited.indexOf(indirect) > -1) {
            // don't keep recursing down to avoid a loop
            return sum;
        }

        const nextItem = ranks[indirect];
        if (!nextItem) {
            // next item doesn't exist in our ranks (most likely it received no votes)
            return sum;
        }
        return traverseIndirectComparisons(ranks, indirect, sum + nextItem.direct, visited.concat([indirect]));
    }, sum);
}

function calculateRanking(strength) {
    // iterate through each pairing
    const ranks = Object.values(strength).reduce((output, item) => {
         // get the sum of the strengths for each direct comparison
        let updatedSum = 0;
        let indirectNodes = [];
        if (output[item.from]) {
            // we've actually already seen this item before, so update the sum and indirect nodes
            updatedSum = output[item.from].direct;
            const currentIndirect = output[item.from]['indirect'];
            indirectNodes = Array.from(currentIndirect);
        }

        // before we can add the comparator node to the indirect list, we need to validate that
        // the preference for this node over that one is greater than the preference for that
        // node over this one
        const opposite = strength[`${item.to}>${item.from}`];
        if (!opposite || opposite.strength < item.strength) {
            indirectNodes.push(item.to);
            updatedSum += item.strength;
        }        

        return Object.assign({}, output, {
            [item.from]: {
                item: item.from,
                direct: updatedSum,
                indirect: indirectNodes
            }
        });
    }, {});

    // now that we have the base direct comparison strengths for each ballot item, we can get the indirect
    // comparison strengths by traversing the indirect array through to either a cycle or end and summing
    // the direct strengths of each node we pass through
    Object.values(ranks).forEach((item) => {
        item.total = item.direct + traverseIndirectComparisons(ranks, item.item, 0, [item.item]);
    });

    // finally, order the results
    const output = Object.values(ranks).map((rank) => ({
        candidate: rank.item,
        value: rank.total
    }));
    return output.sort((rank1, rank2) => rank1.value - rank2.value).reverse();
}

function runSchulze(rawCandidates, ballots, winCount) {
    // convert the candidate list to string values
    const candidates = rawCandidates.map((candidate) => String(candidate));

    const election = prepareBallots(ballots);
    const pairs = generatePairs(candidates);

    // calculate pairwise matrix
    const matrix = calculatePairMatrix(pairs, election.votes);
    
    // determine the strongest paths between every matrix point
    const strengthMatrix = calculateMatrixStrength(matrix, candidates);
    return calculateRanking(strengthMatrix);
};

// const ballots = {
//     a: [2, 1, 3, 0],
//     b: [2, 1, 3, 0],
//     c: [2, 0, 1, 3],
//     d: [3, 1, 2, 0]
// };

// const candidates = [0, 1, 2, 3];

const ballots = {
    a: [1, 3, 2, 0],
    b: [2, 1, 3, 0],
    c: [0, 2, 1, 3],
    d: [0, 1, 2, 3],
    e: [1, 0, 2, 3]
};

const candidates = [0, 1, 2, 3];

// const ballots = {
//     a: [3, 5, 1, 0, 4, 6, 7, 2],
//     b: [1, 7, 0, 3, 6, 5, 4, 2],
//     c: [2, 7, 1, 6, 3, 5, 4, 0],
//     d: [0, 5, 3, 4, 7, 2, 1, 6],
//     e: [2, 6, 4, 3, 7, 0, 1, 5],
//     f: [3, 5, 1, 7, 0, 6, 2, 4],
//     g: [4, 0, 6, 2, 7, 1, 5, 3]
// };

// const candidates = [0, 1, 2, 3, 4, 5, 6, 7];

// const ballots = {
//     a: [3, 5, 1, 0, 4, 2],
//     b: [1, 0, 3, 5, 4, 2],
//     c: [2, 1, 3, 5, 4, 0],
//     d: [0, 5, 3, 4, 2, 1],
//     e: [2, 4, 3, 0, 1, 5],
//     f: [3, 5, 1, 0, 2, 4],
//     g: [4, 0, 2, 1, 5, 3]
// };

// const candidates = [0, 1, 2, 3, 4, 5];

const results = runSchulze(candidates, ballots, 3);
console.log(results);