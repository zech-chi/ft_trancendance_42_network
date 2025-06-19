'use client'

import next from "next";
import { JSX } from "react";
import { useState } from "react";
import Image from "next/image";


type YearData = {
    totalGames: number;
    totalActiveDays: number;
    maxStreak: number;
    DaysData: { [key: string]: number };
};

type CalendarDashboardProps = {
    calendarData: { [year: number]: YearData };
};

// const data: {
//     year: number;
//     totalGames: number;
//     totalActiveDays: number;
//     maxStreak: number;
//     activeYears?: number[];
// } = {
//     year: 2024,
//     totalGames: 317,
//     totalActiveDays:103,
//     maxStreak: 30,
//     activeYears: [2022, 2023, 2024],
// }


function getJanFirstDay(year: number): number {
    const date = new Date(year, 0, 1);
    return date.getDay();
}

function getDaysInMonth(year: number, month: number) : number {
    return new Date(year, month, 0).getDate();
}

function fillActiveDays(): { [key: number]: number } {
    const activeDays: { [key: number]: number } = {};
    for (let i = 1; i <= 366; i++) {
      activeDays[i] = Math.random();
    }
    return activeDays;
}

export default function CalendarDashboard({ calendarData }: CalendarDashboardProps): JSX.Element {
    const years = Object.keys(calendarData).map(Number).sort((a, b) => b - a);
    const [ selectedYear, setSelectedYear ] = useState(years[0]);
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
    const color2 = '#F9545B';
    const color3 = '#FF9D24';
    const color = color1;

    const activeDays = fillActiveDays();

    for (let i = 0; i < 63; i++) {
      const boxes = [];
      for (let j = 0; j < 7; j++) {
        if (divCounter < firstDay) {
            boxes.push(
                <div key={j} className="w-4.5 h-4.5 rounded-[5px]"></div>
            );
            divCounter++;
            continue;
        }
        
        if (totalDays in activeDays && activeDays[totalDays] > 0) {
            if (activeDays[totalDays] == 1)
                boxes.push( <div key={j} className="w-4.5 h-4.5 rounded-[5px]" style={{ backgroundColor: color, opacity: 1}}></div> );
            else if (activeDays[totalDays] >= 0.75)
                boxes.push( <div key={j} className="w-4.5 h-4.5 rounded-[5px]" style={{ backgroundColor: color, opacity: .8}}></div> );
            else if (activeDays[totalDays] >= 0.5) 
                boxes.push( <div key={j} className="w-4.5 h-4.5 rounded-[5px]" style={{ backgroundColor: color, opacity: .60}}></div> );
            else if (activeDays[totalDays] >= 0.25) 
                boxes.push( <div key={j} className="w-4.5 h-4.5 rounded-[5px]" style={{ backgroundColor: color, opacity: .40}}></div> );
            else if (activeDays[totalDays] > 0.1) 
                boxes.push( <div key={j} className="w-4.5 h-4.5 rounded-[5px]" style={{ backgroundColor: color, opacity: .20}}></div> );
            else 
                boxes.push( <div key={j} className="bg-black/50 w-4.5 h-4.5 rounded-[5px]"></div> );
        } else {
            boxes.push(
              <div key={j} className="bg-black/20 w-4.5 h-4.5 rounded-[5px]"></div>
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
                <div key={i} className="flex flex-col gap-1 mx-0.5 mr-4.5">
                    {boxes}
                </div>
            );
        } else {
            allBoxes.push(
                <div key={i} className="flex flex-col gap-1 mx-0.5">
                    {boxes}
                </div>
            );
        }
        if (stop) break;
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex justify-around">
                <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl">
                    <h2 className="text-white/80 text-xl font-bold">{data.totalGames} games in {selectedYear}</h2>
                </div> 
                <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl">
                    <h2 className="text-white/80 text-xl font-bold">Total active days: {data.totalActiveDays}</h2>
                </div> 
                <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl">
                    <h2 className="text-white/80 text-xl font-bold">Max streak: {data.maxStreak}</h2>
                </div> 
                
                <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl flex">
                    <select
                        value={selectedYear}
                        onChange={(event) => setSelectedYear(Number(event.target.value))}
                        className="appearance-none text-white/80 text-xl font-bold"
                    >
                        {years.map((year) => (
                            <option
                                key={year}
                                value={year}
                                className="bg-black/30 hover:bg-black/40 text-white/80 text-xl font-bold"
                                >
                                {year}
                            </option>
                        ))}
                    </select>
                    <Image className="pointer-events-none ml-3" src='/select.png' alt="select" width={25} height={4} />
                </div>
            </div>
            <div className="flex flex-col">
                <div className="" >
                    <div className="flex mx-5 my-3 justify-center">
                        {allBoxes}
                    </div>

                </div>
                <div className="flex justify-around mx-4">
                {[
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ].map((month) => (
                    <div key={month} className="text-white/70 font-bold text-lg">
                    {month}
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}
