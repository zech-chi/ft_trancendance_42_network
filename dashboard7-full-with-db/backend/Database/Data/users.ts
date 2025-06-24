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
        id: 'omKLRQY9S0LYIrVMEkgjG2c3j6k',
        fullName: "Gon Freecss",
        userName: "hunterGon",
        bio: "One heartbeat matters, the next one!",
        imageUrl: "/gon.jpg",
        rank: 1337,
        level: 9,
        progress: .75,
        online: true,
    },
    {
        id: 'KJ5qt8Zh0tciqsgiXFzBhuYq4of',
        fullName: "Zakaria Ech.chifaouy",
        userName: "zech-chi",
        bio: "khaliha 3ala lah! testing",
        imageUrl: "/zech-chi.jpeg",
        rank: 2541,
        level: 12,
        progress: .33,
        online: false,
    },
    {
        id: 'pi07DVZqUqr82Po0NuPjnXxD5Tn',
        fullName: "Killua Zoldyck",
        userName: "killzold",
        bio: "we buy things we don't need with money we don't have to impress people we don't like!",
        imageUrl: "/kilwa.png",
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
