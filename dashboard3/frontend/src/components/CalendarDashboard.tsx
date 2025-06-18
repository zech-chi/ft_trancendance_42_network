import next from "next";
import { JSX } from "react";

const data = {
    year: 2022,
    totalGames: 317,
    totalActiveDays:103,
    maxStreak: 30,
}

function getJanFirstDay(year: number): number {
    const date = new Date(year, 0, 1);
    return date.getDay();
}

function getDaysInMonth(year: number, month: number) : number {
    return new Date(year, month, 0).getDate();
}
  

// console.log(getDaysInMonth(2024, 2)); // 29 (February in leap year)

export default function CalendarDashboard(): JSX.Element {
    const allBoxes = [];

    let firstDay = getJanFirstDay(data.year);
    let curMonth = 1;
    let curNumberOfDays = getDaysInMonth(data.year, curMonth);
    let daysCounter = 0;
    let divCounter = 0;
    console.log("First day of January:", firstDay);
    let nextMonth = false;

    for (let i = 0; i < 62; i++) {
      const boxes = [];
      for (let j = 0; j < 7; j++) {
        if (divCounter < firstDay) {
            boxes.push(
                <div key={j} className="w-5 h-5 rounded"></div>
            );
            divCounter++;
            continue;
        }
        boxes.push(
          <div key={j} className="bg-black w-5 h-5 rounded"></div>
        );
        divCounter++;
        daysCounter++;
        if (daysCounter == curNumberOfDays) {
            nextMonth = true;
            daysCounter = 0;
            curMonth++;
            curNumberOfDays = getDaysInMonth(data.year, curMonth);
            console.log("Current month:", curMonth, "Days in month:", curNumberOfDays);
            console.log("divCounter:", divCounter, "firstDay:", firstDay);
            if ((divCounter) % 7 != 0)
                firstDay = divCounter + 7;
        }
      }

        if (nextMonth) {
            nextMonth = false;
            allBoxes.push(
                <div key={i} className="flex flex-col gap-1 mx-0.5 mr-2.5">
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
        // divCounter++;
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex justify-around">
                <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl">
                    <h2 className="text-white/80 text-xl font-bold">{data.totalGames} games in {data.year}</h2>
                </div> 
                <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl">
                    <h2 className="text-white/80 text-xl font-bold">Total active days: {data.totalActiveDays}</h2>
                </div> 
                <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl">
                    <h2 className="text-white/80 text-xl font-bold">Max streak: {data.maxStreak}</h2>
                </div> 
                <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl">
                    <h2 className="text-white/80 text-xl font-bold">{data.year}</h2>
                </div> 
            </div>
            <div className="flex flex-col">
                <div className="" >
                    <div className="flex mx-5 my-3 justify-center">
                        {allBoxes}
                    </div>

                </div>
                <div className="flex justify-around">
                {[
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ].map((month) => (
                    <div key={month} className="text-white/80 font-bold">
                    {month}
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}

// export default function CalendarDashboard(): JSX.Element {
//     return (
//         <div className="flex flex-col w-full h-full">
//             <div className="flex justify-around">
//                 <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl">
//                     <h2 className="text-white/80 text-xl font-bold">{data.totalGames} games in {data.year}</h2>
//                 </div> 
//                 <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl">
//                     <h2 className="text-white/80 text-xl font-bold">Total active days: {data.totalActiveDays}</h2>
//                 </div> 
//                 <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl">
//                     <h2 className="text-white/80 text-xl font-bold">Max streak: {data.maxStreak}</h2>
//                 </div> 
//                 <div className="bg-black/30 hover:bg-black/40 py-2 px-4 m-2 rounded-4xl">
//                     <h2 className="text-white/80 text-xl font-bold">{data.year}</h2>
//                 </div> 
//             </div>
//             <div className="flex justify-around">
//             {[
//                 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//             ].map((month) => (
//                 <div key={month} className="text-white/80 font-bold">
//                 {month}
//                 </div>
//             ))}
//             </div>

//         </div>
//     );
// }
