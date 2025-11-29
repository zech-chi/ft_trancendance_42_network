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
    'final_played': boolean,
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
            'final_played': false,
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
            final_played: false,
        };
        setTournamentTree(updatedTree);
    }

    
    const add_players_to_round2 = (players: Player[]) => {
        setTournamentTree((prev) => {
          // if no tree yet, initialize it first
          const baseTree: TreeTournament =
            prev ??
            {
              round1: {
                match1: { Player1: null, Player2: null, score: null, round: 1 },
                match2: { Player1: null, Player2: null, score: null, round: 1 },
              },
              round2: { match1: { Player1: null, Player2: null, score: null, round: 2 } },
              winner: null,
              final_played: false,
            };
      
          const updatedTree = JSON.parse(JSON.stringify(baseTree)); // deep clone
      
          if (!updatedTree.round2.match1)
            updatedTree.round2.match1 = { Player1: null, Player2: null, score: null, round: 2 };
      
          updatedTree.round2.match1.Player1 = players.length > 0 ? players[0] : null;
          updatedTree.round2.match1.Player2 = players.length > 1 ? players[1] : null;
          updatedTree.round2.match1.score = null;
      
          return updatedTree;
        });
    };

    const setFinalPlayed = () => {
        setTournamentTree((prev) => {
          if (!prev) return prev;
          const updatedTree = { ...prev, final_played: true };
          return updatedTree;
        });
    }
      
    const getfinalPlayed = (): boolean => {
        return tournamentTree ? tournamentTree.final_played : false;
    }

    const setTheWinner = (player: Player) => { 
        setTournamentTree((prev) => {
            if (!prev) return prev;
            const updatedTree = { ...prev, winner: player };
            return updatedTree;
        });
    } 

    // const updateMatchResult = (round: number, matchNumber: number, score: [number, number]) => {
    //     // logic to update match result and progress players in the tree
    // };

    const resetTournament = () => {
        setTournamentTree(null);
    };

    return (
        <TreeTournamentContext.Provider value={{ tournamentTree, initializeTournament, JoinTournament, add_players_to_round2, resetTournament, setFinalPlayed, getfinalPlayed, setTheWinner }}>
            {children}
        </TreeTournamentContext.Provider>
    );
};
export const useTreeTournament = () => {
    return useContext(TreeTournamentContext);
};

