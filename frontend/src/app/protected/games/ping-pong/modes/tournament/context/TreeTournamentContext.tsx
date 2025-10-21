'use client';

import React, { createContext, useState, useContext } from "react";

type Player = {
    id: number | null,
    name: string | null,
    avatarUrl: string | null,
    status: "win" | "lose" | "pending",
}

type Match = {
    Player1: Player | null,
    Player2: Player | null,
    score: [number, number] | null,
    round: number | null,
}

type TreeTournament = {
    'round1' : {
        match1 : Match | null,
        match2 : Match | null,
    },
    'round2' : {
        match1 : Match | null,
    },
    'winner' : Player | null,
}


export type { Player, Match, TreeTournament };

// creating context that can initilize and provide the tournament tree structure to components
// can reset
// can update match results


const TreeTournamentContext = createContext<any>(null);
export const TreeTournamentProvider = ({ children }: { children: React.ReactNode }) => {
    const [ tournamentTree, setTournamentTree ] = useState<TreeTournament | null>(null);

    const initializeTournament = () => {
        // logic to initialize the tournament tree based on players
        const initialTree: TreeTournament = {
            'round1' : {
                match1 : {
                    Player1: null,
                    Player2: null,
                    score: null,
                    round: 1,
                },
                match2 : {
                    Player1: null,
                    Player2: null,
                    score: null,
                    round: 1,
                },
            },
            'round2' : {
                match1 : {
                    Player1: null,
                    Player2: null,
                    score: null,
                    round: 2,
                },
            },
            'winner' : null,
        };
    };

    const JoinTournament = (players : Player[]) => {
        const updatedTree: TreeTournament = {
            'round1' : {
                match1 : {
                    Player1: players.length > 0 ? players[0] : null,
                    Player2: players.length > 1 ? players[1] : null,
                    score: null,
                    round: 1,
                },
                match2 : {
                    Player1: players.length > 2 ? players[2] : null,
                    Player2: players.length > 3 ? players[3] : null,
                    score: null,
                    round: 1,
                },
            },
            'round2' : {
                match1 : {
                    Player1: null,
                    Player2: null,
                    score: null,
                    round: 2,
                },
            },
            'winner' : null,
        };
        setTournamentTree(updatedTree);
    }

    // const updateMatchResult = (round: number, matchNumber: number, score: [number, number]) => {
    //     // logic to update match result and progress players in the tree
    // };

    const resetTournament = () => {
        setTournamentTree(null);
    };

    return (
        <TreeTournamentContext.Provider value={{ tournamentTree, initializeTournament, JoinTournament, resetTournament }}>
            {children}
        </TreeTournamentContext.Provider>
    );
};
export const useTreeTournament = () => {
    return useContext(TreeTournamentContext);
};

