import { ARiX1k2UCch17pfe6hh6P0xjSCB_DaysData } from './UsersDashboardData/ARiX1k2UCch17pfe6hh6P0xjSCB';
import { KJ5qt8Zh0tciqsgiXFzBhuYq4of_DaysData } from './UsersDashboardData/KJ5qt8Zh0tciqsgiXFzBhuYq4of';
import { omKLRQY9S0LYIrVMEkgjG2c3j6k_DaysData } from './UsersDashboardData/omKLRQY9S0LYIrVMEkgjG2c3j6k';
import { pi07DVZqUqr82Po0NuPjnXxD5Tn_DaysData } from './UsersDashboardData/pi07DVZqUqr82Po0NuPjnXxD5Tn';

import { ARiX1k2UCch17pfe6hh6P0xjSCB_chartsData } from './UsersDashboardData/ARiX1k2UCch17pfe6hh6P0xjSCB';
import { KJ5qt8Zh0tciqsgiXFzBhuYq4of_chartsData } from './UsersDashboardData/KJ5qt8Zh0tciqsgiXFzBhuYq4of';
import { omKLRQY9S0LYIrVMEkgjG2c3j6k_chartsData } from './UsersDashboardData/omKLRQY9S0LYIrVMEkgjG2c3j6k';
import { pi07DVZqUqr82Po0NuPjnXxD5Tn_chartsData } from './UsersDashboardData/pi07DVZqUqr82Po0NuPjnXxD5Tn';

import { ARiX1k2UCch17pfe6hh6P0xjSCB_radarData } from './UsersDashboardData/ARiX1k2UCch17pfe6hh6P0xjSCB';
import { KJ5qt8Zh0tciqsgiXFzBhuYq4of_radarData } from './UsersDashboardData/KJ5qt8Zh0tciqsgiXFzBhuYq4of';
import { omKLRQY9S0LYIrVMEkgjG2c3j6k_radarData } from './UsersDashboardData/omKLRQY9S0LYIrVMEkgjG2c3j6k';
import { pi07DVZqUqr82Po0NuPjnXxD5Tn_radarData } from './UsersDashboardData/pi07DVZqUqr82Po0NuPjnXxD5Tn';

export interface User {
    id: string,
    fullName: string,
    userName: string,
    bio: string,
    imageUrl: string,
    rank: number,
    level: number,
    progress: number,
    online: boolean
}

type YearData = {
    totalGames: number;
    totalActiveDays: number;
    maxStreak: number;
    DaysData: { [key: string]: number };
}

export const Users: User[] = [
    {
        id       : 'omKLRQY9S0LYIrVMEkgjG2c3j6k',
        fullName : "Gon Freecss",
        userName : "hunterGon",
        bio      : "One heartbeat matters, the next one!",
        imageUrl : "/gon.jpg",
        rank     : 1337,
        level    : 9,
        progress : .75,
        online   : true,
    },
    {
        id       : 'KJ5qt8Zh0tciqsgiXFzBhuYq4of',
        fullName : "Zakaria Ech.chifaouy",
        userName : "zech-chi",
        bio      : "khaliha 3ala lah! testing",
        imageUrl : "/zech-chi.jpeg",
        rank     : 2541,
        level    : 12,
        progress : .33,
        online   : false,
    },
    {
        id       : 'pi07DVZqUqr82Po0NuPjnXxD5Tn',
        fullName : "Killua Zoldyck",
        userName : "killzold",
        bio      : "we buy things we don't need with money we don't have to impress people we don't like!",
        imageUrl : "/kilwa.png",
        rank: 52,
        level: 45,
        progress: .42,
        online: false,
    },
    {
        id: 'ARiX1k2UCch17pfe6hh6P0xjSCB',
        fullName: "SAW X",
        userName: "saw",
        bio: "live or die! the choice is yours!",
        imageUrl: "/saw.jpg",
        rank: 22,
        level: 22,
        progress: .73,
        online: true,
    }
]

export const RadarData = [
    {
        userId              : 'omKLRQY9S0LYIrVMEkgjG2c3j6k',
        Quick_Reflexes      : 11.3,
        Strategic_Thinking  : 2.7,
        Precision_Shots     : 18.9,
        Pattern_Recognition : 6.4,
        Anticipating_Moves  : 0.5,
        Board_Control       : 13.8,
        Adaptive_Playstyle  : 7.6,
        Risk_Management     : 16.2,
        Mind_Games          : 3.9
    },
    {
        userId: 'KJ5qt8Zh0tciqsgiXFzBhuYq4of',
        Quick_Reflexes      : 12.4,
        Strategic_Thinking  : 19.7,
        Precision_Shots     : 4.3,
        Pattern_Recognition : 8.6,
        Anticipating_Moves  : 17.1,
        Board_Control       : 0.9,
        Adaptive_Playstyle  : 15.5,
        Risk_Management     : 6.2,
        Mind_Games          : 2.8
    },
    {
        userId: 'pi07DVZqUqr82Po0NuPjnXxD5Tn',
        Quick_Reflexes      : 4.6,
        Strategic_Thinking  : 19.2,
        Precision_Shots     : 7.1,
        Pattern_Recognition : 12.8,
        Anticipating_Moves  : 0.3,
        Board_Control       : 16.5,
        Adaptive_Playstyle  : 2.9,
        Risk_Management     : 10.4,
        Mind_Games          : 8.7
    },
    {
        userId: 'ARiX1k2UCch17pfe6hh6P0xjSCB',
        Quick_Reflexes      : 17.2,
        Strategic_Thinking  : 3,
        Precision_Shots     : 17,
        Pattern_Recognition : 3.5,
        Anticipating_Moves  : 9.1,
        Board_Control       : 1,
        Adaptive_Playstyle  : 15,
        Risk_Management     : 7.3,
        Mind_Games          : 13
    }
]


export const daysDataMap: {[userId: string] : { [year: number] : YearData}} = {
    'omKLRQY9S0LYIrVMEkgjG2c3j6k': omKLRQY9S0LYIrVMEkgjG2c3j6k_DaysData,
    'KJ5qt8Zh0tciqsgiXFzBhuYq4of': KJ5qt8Zh0tciqsgiXFzBhuYq4of_DaysData,
    'pi07DVZqUqr82Po0NuPjnXxD5Tn': pi07DVZqUqr82Po0NuPjnXxD5Tn_DaysData,
    'ARiX1k2UCch17pfe6hh6P0xjSCB': ARiX1k2UCch17pfe6hh6P0xjSCB_DaysData,
}


export const chartsDataMap: {[userId: string] : { [year: number] : YearData}} = {
    'omKLRQY9S0LYIrVMEkgjG2c3j6k': omKLRQY9S0LYIrVMEkgjG2c3j6k_chartsData,
    'KJ5qt8Zh0tciqsgiXFzBhuYq4of': KJ5qt8Zh0tciqsgiXFzBhuYq4of_chartsData,
    'pi07DVZqUqr82Po0NuPjnXxD5Tn': pi07DVZqUqr82Po0NuPjnXxD5Tn_chartsData,
    'ARiX1k2UCch17pfe6hh6P0xjSCB': ARiX1k2UCch17pfe6hh6P0xjSCB_chartsData,
}

export const radarDataMap: {[userId: string] : Number[] } = {
    'omKLRQY9S0LYIrVMEkgjG2c3j6k': omKLRQY9S0LYIrVMEkgjG2c3j6k_radarData,
    'KJ5qt8Zh0tciqsgiXFzBhuYq4of': KJ5qt8Zh0tciqsgiXFzBhuYq4of_radarData,
    'pi07DVZqUqr82Po0NuPjnXxD5Tn': pi07DVZqUqr82Po0NuPjnXxD5Tn_radarData,
    'ARiX1k2UCch17pfe6hh6P0xjSCB': ARiX1k2UCch17pfe6hh6P0xjSCB_radarData,
}
