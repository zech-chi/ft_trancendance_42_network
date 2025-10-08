'use client'

import { JSX } from "react";
import { useState } from "react";
import { useEffect, useMemo } from "react";


type YearData = {
    totalGames: number;
    totalActiveDays: number;
    maxStreak: number;
    DaysData: { [key: string]: number };
};

type CalendarDashboardProps = {
    calendarData: { [year: number]: YearData };
};

function getJanFirstDay(year: number): number {
    const date = new Date(year, 0, 1);
    return date.getDay();
}

function getDaysInMonth(year: number, month: number) : number {
    return new Date(year, month, 0).getDate();
}

function isPrime(n: number): boolean {
    if (n < 2) return false
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false
    }
    return true
}

export default function CalendarDashboard(): JSX.Element {
    const calendarData: { [year: number]: YearData } = {
        2022: {
            totalGames: 31,
            totalActiveDays: 90,
            maxStreak: 21,
            DaysData: (() => {
            const days: { [key: number]: number } = {};
            for (let i = 1; i <= 365; i++) {
                days[i] = Math.random() > 0.7 ? Math.random() : 0;
            }
            return days;
            })(),
        },
        2023: {
            totalGames: 300,
            totalActiveDays: 100,
            maxStreak: 27,
            DaysData: (() => {
            const days: { [key: number]: number } = {};
            for (let i = 1; i <= 365; i++) {
                days[i] = Math.random() > 0.65 ? Math.random() : 0;
            }
            return days;
            })(),
        },
        2024: {
            totalGames: 317,
            totalActiveDays: 103,
            maxStreak: 30,
            DaysData: (() => {
            const days: { [key: number]: number } = {};
            for (let i = 1; i <= 366; i++) {
                days[i] = Math.random() > 0.6 ? Math.random() : 0;
            }
            return days;
            })(),
        },
    };

    const years = useMemo(() => {
        return Object.keys(calendarData).map(Number).sort((a, b) => b - a);
    }, [calendarData]);
    
    const [ selectedYear, setSelectedYear ] = useState(years[0]);
    
    useEffect(() => {
        if (years.length > 0 && selectedYear !== years[0])
            setSelectedYear(years[0]);
    }, [calendarData, years]);
    
    if (!selectedYear || !calendarData[selectedYear])
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    
    const data = calendarData[selectedYear];
    const allBoxes = [];
    let firstDay = getJanFirstDay(selectedYear);
    let curMonth = 1;
    let curNumberOfDays = getDaysInMonth(selectedYear, curMonth);
    let daysCounter = 0;
    let divCounter = 0;
    let nextMonth = false;
    let stop = false;
    let totalDays = 1;
    const color1 = '#FEDF7F';
    const color = color1;

    const activeDays = calendarData[selectedYear].DaysData;

    for (let i = 0; i < 63; i++) {
      const boxes = [];
      for (let j = 0; j < 7; j++) {
        if (divCounter < firstDay) {
            boxes.push(
                <div key={j} className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 rounded-sm sm:rounded-md"></div>
            );
            divCounter++;
            continue;
        }
        
        if (totalDays in activeDays && activeDays[totalDays] > 0) {
            let opacity = 0.2;
            if (activeDays[totalDays] == 1) opacity = 1;
            else if (activeDays[totalDays] >= 0.75) opacity = 0.8;
            else if (activeDays[totalDays] >= 0.5) opacity = 0.6;
            else if (activeDays[totalDays] >= 0.25) opacity = 0.4;
            
            boxes.push(
                <div 
                    key={j} 
                    className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 rounded-sm sm:rounded-md transition-all hover:scale-110 hover:ring-1 hover:ring-white/30" 
                    style={{ backgroundColor: color, opacity }}
                ></div>
            );
        } else {
            boxes.push(
              <div key={j} className="bg-white/10 w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 rounded-sm sm:rounded-md"></div>
            );
        }
        divCounter++;
        daysCounter++;
        totalDays++;
        if (daysCounter == curNumberOfDays) {
            nextMonth = true;
            daysCounter = 0;
            if (curMonth == 12)
                stop = true;
            curMonth++;
            curNumberOfDays = getDaysInMonth(selectedYear, curMonth);
            if ((divCounter) % 7 != 0)
                firstDay = divCounter + 7;
        }
      }

        if (nextMonth && !stop) {
            nextMonth = false;
            allBoxes.push(
                <div key={i} className="flex flex-col gap-[2px] sm:gap-[3px] mx-[1px] sm:mx-[2px] mr-1 sm:mr-2 lg:mr-4">
                    {boxes}
                </div>
            );
        } else {
            allBoxes.push(
                <div key={i} className="flex flex-col gap-[2px] sm:gap-[3px] mx-[1px] sm:mx-[2px]">
                    {boxes}
                </div>
            );
        }
        if (stop) break;
    }

    return (
        <div className="flex flex-col w-full p-2 sm:p-4 lg:p-6">

            <style jsx global>{`
                /* Beautiful custom scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                    margin: 0 20px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: black;
                    border-radius: 10px;
                    border: 2px solid rgba(0, 0, 0, 0.2);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(90deg, #FFE89F 0%, #FFB144 100%);
                }
            `}</style>

            {/* Stats Grid - Responsive Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
                {/* Games Stat */}
                <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm hover:from-black/50 hover:to-black/30 py-3 px-4 sm:py-4 sm:px-5 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 border border-white/5">
                    <p className="text-white/50 text-xs sm:text-sm mb-1">Total Games</p>
                    <h2 className="text-white/90 text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">{data.totalGames}</h2>
                    <p className="text-white/40 text-xs mt-1">{selectedYear}</p>
                </div>
                
                {/* Active Days Stat */}
                <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm hover:from-black/50 hover:to-black/30 py-3 px-4 sm:py-4 sm:px-5 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 border border-white/5">
                    <p className="text-white/50 text-xs sm:text-sm mb-1">Active Days</p>
                    <h2 className="text-white/90 text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-200 to-green-400 bg-clip-text text-transparent">{data.totalActiveDays}</h2>
                    <p className="text-white/40 text-xs mt-1">{Math.round((data.totalActiveDays / 365) * 100)}% of year</p>
                </div>
                
                {/* Max Streak Stat */}
                <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm hover:from-black/50 hover:to-black/30 py-3 px-4 sm:py-4 sm:px-5 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 border border-white/5">
                    <p className="text-white/50 text-xs sm:text-sm mb-1">Max Streak</p>
                    <h2 className="text-white/90 text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-200 to-red-400 bg-clip-text text-transparent">{data.maxStreak}</h2>
                    <p className="text-white/40 text-xs mt-1">days in a row</p>
                </div>
                
                {/* Year Selector */}
                <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm hover:from-black/50 hover:to-black/30 py-3 px-4 sm:py-4 sm:px-5 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 border border-white/5 flex flex-col justify-center">
                    <p className="text-white/50 text-xs sm:text-sm mb-2">Select Year</p>
                    <select
                        value={selectedYear}
                        onChange={(event) => setSelectedYear(Number(event.target.value))}
                        className="bg-white/10 text-white/90 text-lg sm:text-xl lg:text-2xl font-bold rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 cursor-pointer hover:bg-white/20 transition-all"
                    >
                        {years.map((year) => (
                            <option
                                key={year}
                                value={year}
                                className="bg-gray-800 text-white"
                            >
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Calendar Section */}
            <div className="flex flex-col bg-gradient-to-br from-black/6 to-black/1 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-white/5">
                {/* Calendar Grid with Month Labels - All Scrollable */}
                <div className="overflow-x-auto custom-scrollbar pb-3">
                    <div className="min-w-max">
                        {/* Calendar Grid */}
                        <div className="flex justify-center items-center px-2 sm:px-4 mb-3">
                            <div className="flex gap-[1px] sm:gap-[2px]">
                                {allBoxes}
                            </div>
                        </div>

                        {/* Month Labels - Inside scroll view */}
                        <div className="flex justify-around px-2 sm:px-4">
                            {[
                                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                            ].map((month) => (
                                <div key={month} className="text-white/60 font-semibold text-xs sm:text-sm lg:text-base flex-1 text-center">
                                    {month}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-white/10">
                    <span className="text-white/50 text-xs sm:text-sm font-medium">Less</span>
                    {[0.2, 0.4, 0.6, 0.8, 1].map((opacity, idx) => (
                        <div
                            key={idx}
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm sm:rounded-md hover:scale-125 transition-transform"
                            style={{ backgroundColor: color1, opacity }}
                        ></div>
                    ))}
                    <span className="text-white/50 text-xs sm:text-sm font-medium">More</span>
                </div>
            </div>
        </div>
    );
}