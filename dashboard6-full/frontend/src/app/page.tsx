'use client'

import { JSX } from "react";
import TopDashboard from "@/components/TopDashboard";
import CalendarDashboard from "@/components/CalendarDashboard";
import Statistics from "@/components/Statistics";
import {useEffect, useState} from 'react';
import Login from "@/components/Login";


const TOTAL_USERS = 133742;

const user1 = {
  fullName: "Gon Freecss",
  userName: "hunterGon",
  bio: "One heartbeat matters, the next one!",
  imageUrl: "/gon.jpg",
  rank: 1337,
  level: 9,
  progress: .75,
  online: true,
}

const user2 = {
  fullName: "Zakaria Ech.chifaouy",
  userName: "zech-chi",
  bio: "we buy things we don't need with money we don't have to impress people we don't like!",
  imageUrl: "/kilwa.png",
  rank: 2541,
  level: 12,
  progress: .33,
  online: false,
}


// calendar data

type YearData = {
  totalGames: number;
  totalActiveDays: number;
  maxStreak: number;
  DaysData: { [key: string]: number };
}

const calendarData : { [year: number] : YearData} = {
  2024: {
      totalGames: 317,
      totalActiveDays: 103,
      maxStreak: 30,
      DaysData: {
      }
  },
  2023: {
      totalGames: 250,
      totalActiveDays: 90,
      maxStreak: 25,
      DaysData: {
      }
  },
  2022: {
      totalGames: 200,
      totalActiveDays: 80,
      maxStreak: 20,
      DaysData: {
      }
  },

  2021: {
      totalGames: 150,
      totalActiveDays: 70,
      maxStreak: 15,
      DaysData: {
      }
  },
  2020: {
      totalGames: 100,
      totalActiveDays: 60,
      maxStreak: 10,
      DaysData: {
      }
  },
  2019: {
      totalGames: 50,
      totalActiveDays: 40,
      maxStreak: 5,
      DaysData: {
      }
  },
}

function fillDays(): { [key: number]: number } {
  const activeDays: { [key: number]: number } = {};
  for (let i = 1; i <= 366; i++) {
    activeDays[i] = Math.random();
  }
  return activeDays;
}

// end calendar data


// charts ai data

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

// end charts data

const fetchUser = async (userName: string) => {
  const response = await fetch(`http://localhost:5000/users/${userName}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}




export default function Home() : JSX.Element {
  // fill days data
  Object.keys(calendarData).forEach((year) => {
    calendarData[+year].DaysData = fillDays();
  })

  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  let chartsData = chartsData1;
  useEffect(() => {
    if (username) {
      console.log('Fetching user for:', username);
      fetchUser(username)
        .then((data) => {
          console.log('Fetched user data:', data);
          setUser(data)
        })
        .catch((err) => console.error("Error: ", err));
    }
  }, [username])

  useEffect(() => {
    console.log('Updated user:', user);
  }, [user]);

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
        {
          (username && user) ? (
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
              <Statistics chartsData={chartsData} />
            </div>
            </>
          ) : (
            <Login onLogin={setUsername}/>
          )
        }

      </main>
  );
}
