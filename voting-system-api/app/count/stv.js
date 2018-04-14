function prepareBallots(raw) {
    // we need to convert each ballot into an array of objects with the candidate and vote value
    // this is to handle subsequent rounds when the vote surplus will allow partial votes
    return Object.values(raw).map((ballot) => (
        ballot.map((candidate) => ({
            candidate: String(candidate),
            vote: 1
        }))
    ));
}

function selectRVH(ballots) {
    const rvhIndex = Math.floor(Math.random() * Object.keys(ballots).length);
    const rvhId = Object.keys(ballots)[rvhIndex];

    // parse the ballot values into strings
    const votes = prepareBallots([ballots[rvhId]])[0];

    return {
        id: rvhId,
        ballot: votes
    };
}

function winQuota(ballots, winCount) {
    return Math.floor(ballots.length / (winCount + 1)) + 1;
}

function firstChoices(ballots) {
    return ballots.map((ballot) => ballot[0]);
}

function findLowest(counts, rvh) {
    const lowestCount = Math.min(...Object.values(counts));
    const lowestCandidates = Object.keys(counts).filter((candidate) => counts[candidate] === lowestCount);
    if (lowestCandidates.length ===  1) {
        return lowestCandidates[0];
    }

    // there's a tie, break it using RVH
    // because the ballot is ordered with highest preference first, we will reverse it to get
    // the lowest preferred candidate first
    const rvhBallot = Array.from(rvh.ballot).reverse();
    for (const preference of rvhBallot) {
        if (lowestCandidates.indexOf(preference.candidate) > -1) {
            // we found one, use it
            return preference.candidate;
        }
    }
}

function transferVote(ballot, target, portion = 1) {
    const updatedBallot = [];
    for (let i = 0; i < ballot.length; i++) {
        const preference = ballot[i];
        if (preference.candidate !== target) {
            // not the target candidate, just copy it over
            updatedBallot.push(Object.assign({}, preference));
            continue;
        }

        // otherwise, this is the candidate, so move its votes to the previous (more preferred) candidate
        if (i > 0) {
            const prevCandidate = updatedBallot[updatedBallot.length - 1];
            prevCandidate.vote += preference.vote * portion;
            continue;
        }
        // unless this is the top candidate, in which case move its votes to the next less preferred candidate
        if (ballot.length > 1) {
            const nextCandidate = ballot[i + 1];
            updatedBallot.push(Object.assign({}, nextCandidate, {
                vote: nextCandidate.vote + (preference.vote * portion)
            }));
            // skip the next candidate bc we've just copied it over
            i++;
        }
    }
    return updatedBallot;
}

function eliminateLowest(ballots, rvh, counts) {
    // first determine the lowest candidate
    const lowestCandidate = findLowest(counts, rvh);
    
    // eliminate the candidate from all the ballots
    const updatedBallots = ballots.map((ballot) => (
        transferVote(ballot, lowestCandidate, 1)
    ));

    // do the same for the RVH
    const updatedRVH = Object.assign({}, rvh, {
        ballot: transferVote(rvh.ballot, lowestCandidate, 1)
    });
    
    return {
        ballots: updatedBallots,
        rvh: updatedRVH   
    };
}

function removeWinner(winner, ballots, rvh, quota, counts) {
    // determine the surplus over the quota
    const winningCount = counts[winner];
    const transferRatio = (winningCount - quota) / winningCount;
    
    // transfer the candidate's votes in all the ballots
    const updatedBallots = ballots.map((ballot) => (
        transferVote(ballot, winner, transferRatio)
    ));

    // do the same for the RVH
    const updatedRVH = Object.assign({}, rvh, {
        ballot: transferVote(rvh.ballot, winner, transferRatio)
    });
    
    return {
        ballots: updatedBallots,
        rvh: updatedRVH   
    };
}

function countVotes(ballots, quota, rvh, remaining = 0) {
    if (remaining <= 0) {
        // no more cycles to run
        return [];
    }

    // get everyone's top choice
    const first = firstChoices(ballots);
    // determine the winners of this round (everyone that has reached or passed the quota)
    const candidateCounts = first.reduce((sums, preference) => {
        const candidate = preference.candidate;
        const count = preference.vote;
        if (sums[candidate]) {
            return Object.assign({}, sums, {
                [candidate]: sums[candidate] + count
            });
        }
        return Object.assign({}, sums, {
            [candidate]: count
        });
    }, {});

    // now determine the winners
    const winners = Object.keys(candidateCounts).filter((candidate) => candidateCounts[candidate] >= quota);
    console.log(candidateCounts);
    if (winners.length === 0) {
        // no one got the win quota, remove the lowest top ranked candidate and try again
        const updatedElection = eliminateLowest(ballots, rvh, candidateCounts);

        // redo the count using the updated ballots
        return countVotes(updatedElection.ballots, quota, updatedElection.rvh, remaining);
    }

    const unfilledSeats = remaining - winners.length;
    if (unfilledSeats === 0) {
        // we are done
        return winners;
    }
    else if (unfilledSeats < 0) {
        // something went wrong and we picked too many (most likely due to ties)
        // just slice to the difference
        return winners.slice(0, remaining);
    }

    
    // we need to do more rounds of the election
    // to do so, we need to transfer the winning candidates' votes to voters' next preferred candidate
    // but we can't transfer the whole vote, since some of it was used to make the winner win
    let updatedElection = {
        ballots,
        rvh
    };
    
    winners.forEach((winner) => {
        updatedElection = removeWinner(winner, updatedElection.ballots, updatedElection.rvh, quota, candidateCounts);
    });

    const remainingWinners = countVotes(updatedElection.ballots, quota, updatedElection.rvh, unfilledSeats);
    return Array.from(winners).concat(remainingWinners);
}

function runSTV(rawCandidates, rawBallots, count) {
    // convert candidates to strings
    const candidates = rawCandidates.map((candidate) => String(candidate));
    // convert ballots to strings
    const ballots = prepareBallots(rawBallots);

    // pick a ballot to use to break ties
    const rvh = selectRVH(rawBallots);

    // determine the win quota
    const winCount = Math.min(count, candidates.length);
    const quota = winQuota(ballots, winCount);
    console.log(quota);

    // count the votes
    const results = countVotes(ballots, quota, rvh, winCount);
    return results;
};

// const ballots = {
//     a: [2, 1, 3, 0],
//     b: [2, 1, 3, 0],
//     c: [2, 0, 1, 3],
//     d: [3, 1, 2, 0]
// };

// const candidates = [0, 1, 2, 3];

// const ballots = {
//     a: [1, 3, 2, 0],
//     b: [2, 1, 3, 0],
//     c: [0, 2, 1, 3],
//     d: [0, 1, 2, 3],
//     e: [1, 0, 2, 3]
// };
// const candidates = [0, 1, 2, 3];

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

const ballots = {
    a: [3, 5, 1, 0, 4, 2],
    b: [1, 0, 3, 5, 4, 2],
    c: [2, 1, 3, 5, 4, 0],
    d: [0, 5, 3, 4, 2, 1],
    e: [2, 4, 3, 0, 1, 5],
    f: [3, 5, 1, 0, 2, 4],
    g: [4, 0, 2, 1, 5, 3]
};

const candidates = [0, 1, 2, 3, 4, 5];

const results = runSTV(candidates, ballots, 3);
console.log(results);