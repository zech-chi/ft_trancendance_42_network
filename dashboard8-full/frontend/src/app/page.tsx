'use client'

import { JSX } from "react";
import TopDashboard from "@/components/TopDashboard";
import CalendarDashboard from "@/components/CalendarDashboard";
import Statistics from "@/components/Statistics";
import Frineds from "@/components/Friends";
import History from "@/components/History";
import Rank from "@/components/Rank";
import {useEffect, useState} from 'react';
import Login from "@/components/Login";
import Image from "next/image";
import { useUserName } from "@/context/UserNameContext";

const TOTAL_USERS = 133742;

// calendar data

type YearData = {
  totalGames: number;
  totalActiveDays: number;
  maxStreak: number;
  DaysData: { [key: string]: number };
}


export type ChartDataTypes = {
  // for games with AI

  totalGamesWithAi: number;
  gamesWithAiEasy: number;
  gamesWithAiMedium: number;
  gamesWithAiHard: number;
  totalWins: number;
  easyWins: number;
  mediumWins: number;
  hardWins: number;

  // for games with friends
  friendsWins: number;
  friendsLosses: number;
  friendsTotalGames: number;
}

export type StatisticsProps = {
  chartsData: { [game: string]: ChartDataTypes };
};

const chartsData1 = {
  pong: {
    totalGamesWithAi: 974,            
    gamesWithAiEasy: 53,
    gamesWithAiMedium: 451,
    gamesWithAiHard: 470,
    totalWins: 747,
    easyWins: 50,
    mediumWins: 408,
    hardWins: 289,
    friendsWins: 617,
    friendsLosses: 235,
    friendsTotalGames: 852,
  },
  parchesi: {
    totalGamesWithAi: 501,         
    gamesWithAiEasy: 73,
    gamesWithAiMedium: 209,
    gamesWithAiHard: 219,
    totalWins: 446,                
    easyWins: 73,
    mediumWins: 198,
    hardWins: 175,
    friendsWins: 629,
    friendsLosses: 486,
    friendsTotalGames: 1115,  
  }
}

const chartsData2 = {
  pong: {
    totalGamesWithAi: 1263,
    gamesWithAiEasy: 98,
    gamesWithAiMedium: 627,
    gamesWithAiHard: 538,
    totalWins: 915,
    easyWins: 95,
    mediumWins: 582,
    hardWins: 238,
    friendsWins: 842,
    friendsLosses: 317,
    friendsTotalGames: 1159
  },
  parchesi: {
    totalGamesWithAi: 872,
    gamesWithAiEasy: 124,
    gamesWithAiMedium: 387,
    gamesWithAiHard: 361,
    totalWins: 634,
    easyWins: 118,
    mediumWins: 350,
    hardWins: 166,
    friendsWins: 703,
    friendsLosses: 422,
    friendsTotalGames: 1125
  }
};

type GameStats = {
  totalGamesWithAi: number;
  gamesWithAiEasy: number;
  gamesWithAiMedium: number;
  gamesWithAiHard: number;
  totalWins: number;
  easyWins: number;
  mediumWins: number;
  hardWins: number;
  friendsWins: number;
  friendsLosses: number;
  friendsTotalGames: number;
};

type ChartsData = {
  pong: GameStats;
  parchesi: GameStats;
};

// end charts data

const fetchUser = async (userName: string) => {
  const response = await fetch(`http://localhost:5000/users/${userName}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}


const fetchDaysData = async (userName: string) => {
  const response = await fetch(`http://localhost:5000/daysData/${userName}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}


const fetchChartsData = async (userName: string) => {
  const response = await fetch(`http://localhost:5000/chartsData/${userName}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

const fetchRadarData = async (userName: string) => {
  const response = await fetch(`http://localhost:5000/radarData/${userName}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export default function Home() : JSX.Element {
  // fill days data
  const { username, setUserName } = useUserName();
  const [user, setUser] = useState<any | null>(null);
  const [calendarData, setCalendarData] = useState<{ [year: number] : YearData } | null>(null);
  const [chartsData, setChartsData] = useState<ChartsData | null>(null);
  const [radarData, setRadarData] = useState<Number[] | null>(null);
  const [buttonChoice, setButtonChoice] = useState<string>('rank');

  useEffect(() => {
    if (username) {
      console.log('Fetching user for:', username);
      fetchUser(username)
        .then((data) => {
          console.log('Fetched user data:', data);
          setUser(data)
        })
        .catch((err) => console.error("Error: ", err));

      fetchDaysData(username)
        .then((data) => setCalendarData(data))
        .catch((err) => console.error("Error: ", err));
      
      fetchChartsData(username)
        .then((data) => setChartsData(data))
        .catch((err) => console.error("Error: ", err));

      fetchRadarData(username)
        .then((data) => {
          const radarDataArray = [
            data.Quick_Reflexes,
            data.Strategic_Thinking,
            data.Precision_Shots,
            data.Pattern_Recognition,
            data.Anticipating_Moves,
            data.Board_Control,
            data.Adaptive_Playstyle,
            data.Risk_Management,
            data.Mind_Games,
          ]
          setRadarData(radarDataArray);
        }
        )
        .catch((err) => console.error("Error: ", err));
    }
  }, [username]);

  useEffect(() => {
    console.log('Updated user:', user);
  }, [user]);

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
        {
          (username && user && calendarData && chartsData && radarData) ? (
            <>
            <div className="absolute top-20 bottom-0 left-25 w-3/4 w-[calc(65%-1rem)] m-4 rounded-[50px]"
              style={{
                background:
                'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(to top, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
                backgroundBlendMode: 'overlay',
              }}
            >
              <TopDashboard user={user} totalUsers={TOTAL_USERS} />
            </div>
    
            <div className="absolute top-72 h-70 left-34 w-3/4 w-[calc(63.5%-1rem)] rounded-4xl justify-center items-center flex"
              style={{
                background:
                'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), linear-gradient(to top, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
                backgroundBlendMode: 'overlay',
              }}
            >
              <CalendarDashboard calendarData={calendarData} />
            </div>
            <div className="absolute top-143 h-190 left-29 w-3/4 w-[calc(65%-1rem)] flex flex-col">
              <Statistics chartsData={chartsData} radarData={radarData as number[]} />
            </div>

            <div
              className="absolute top-20 bottom-0 right-25 w-[calc(26.6%-1rem)] m-4 rounded-[50px] text-white flex flex-col items-center justify-center"
              style={{
                background:
                  'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), linear-gradient(to top, rgba(42, 21, 34, .8), rgba(96, 31, 48, .8) 100%)',
                backgroundBlendMode: 'overlay',
              }}
            >
              <div className="rounded-[50px] w-[95%] h-[97.5%] bg-black/40">
                {buttonChoice === 'friends' && <Frineds />}
                {buttonChoice === 'history' && <History />}
                {buttonChoice === 'rank' && <Rank />}
              </div>
            </div>

            <aside className="fixed right-2 top-1/2 -translate-y-1/2 h-113 w-23 rounded-full bg-black/60 backdrop-blur p-4 z-10 flex flex-col item-center justify-center gap-10">
                <button className="bg-black/50 hover:bg-black/75 rounded-full w-15 h-15 flex item-center justify-center transition"
                  onClick={() => setButtonChoice('friends')}
                >
                  <Image
                    src={buttonChoice === 'friends' ? '/friends_pink.png' : '/friends.png'}
                    alt='friends'
                    width={27}
                    height={27}
                    className="object-contain"
                  />
                </button>
                <button className="bg-black/50 hover:bg-black/75 rounded-full w-15 h-15 flex item-center justify-center transition"
                  onClick={() => setButtonChoice('history')}
                >
                  <Image
                    src={buttonChoice === 'history' ? '/history_pink.png' : '/history.png'}
                    alt='history'
                    width={27}
                    height={27}
                    className="object-contain"
                  />
                </button>
                <button className="bg-black/50 hover:bg-black/75 rounded-full w-15 h-15 flex item-center justify-center transition"
                  onClick={() => setButtonChoice('rank')}
                >
                  <Image
                    src={buttonChoice === 'rank' ? '/rank_pink.png' : '/rank.png'}
                    alt='rank'
                    width={27}
                    height={27}
                    className="object-contain"
                  />
                </button>
            </aside>
            </>
          ) : (
            <Login onLogin={setUserName}/>
          )
        }

      </main>
  );
}
