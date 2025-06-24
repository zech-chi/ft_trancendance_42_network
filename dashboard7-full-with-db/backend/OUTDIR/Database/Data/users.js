"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.radarDataMap = exports.chartsDataMap = exports.daysDataMap = exports.ChartsData = exports.RadarData = exports.Users = void 0;
const ARiX1k2UCch17pfe6hh6P0xjSCB_1 = require("./UsersDashboardData/ARiX1k2UCch17pfe6hh6P0xjSCB");
const KJ5qt8Zh0tciqsgiXFzBhuYq4of_1 = require("./UsersDashboardData/KJ5qt8Zh0tciqsgiXFzBhuYq4of");
const omKLRQY9S0LYIrVMEkgjG2c3j6k_1 = require("./UsersDashboardData/omKLRQY9S0LYIrVMEkgjG2c3j6k");
const pi07DVZqUqr82Po0NuPjnXxD5Tn_1 = require("./UsersDashboardData/pi07DVZqUqr82Po0NuPjnXxD5Tn");
const ARiX1k2UCch17pfe6hh6P0xjSCB_2 = require("./UsersDashboardData/ARiX1k2UCch17pfe6hh6P0xjSCB");
const KJ5qt8Zh0tciqsgiXFzBhuYq4of_2 = require("./UsersDashboardData/KJ5qt8Zh0tciqsgiXFzBhuYq4of");
const omKLRQY9S0LYIrVMEkgjG2c3j6k_2 = require("./UsersDashboardData/omKLRQY9S0LYIrVMEkgjG2c3j6k");
const pi07DVZqUqr82Po0NuPjnXxD5Tn_2 = require("./UsersDashboardData/pi07DVZqUqr82Po0NuPjnXxD5Tn");
const ARiX1k2UCch17pfe6hh6P0xjSCB_3 = require("./UsersDashboardData/ARiX1k2UCch17pfe6hh6P0xjSCB");
const KJ5qt8Zh0tciqsgiXFzBhuYq4of_3 = require("./UsersDashboardData/KJ5qt8Zh0tciqsgiXFzBhuYq4of");
const omKLRQY9S0LYIrVMEkgjG2c3j6k_3 = require("./UsersDashboardData/omKLRQY9S0LYIrVMEkgjG2c3j6k");
const pi07DVZqUqr82Po0NuPjnXxD5Tn_3 = require("./UsersDashboardData/pi07DVZqUqr82Po0NuPjnXxD5Tn");
exports.Users = [
    // user1
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
    // user2
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
    // user3
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
    // user4
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
];
exports.RadarData = [
    // user1 
    {
        userId: 'omKLRQY9S0LYIrVMEkgjG2c3j6k',
        Quick_Reflexes: 11.3,
        Strategic_Thinking: 2.7,
        Precision_Shots: 18.9,
        Pattern_Recognition: 6.4,
        Anticipating_Moves: 0.5,
        Board_Control: 13.8,
        Adaptive_Playstyle: 7.6,
        Risk_Management: 16.2,
        Mind_Games: 3.9
    },
    // user2
    {
        userId: 'KJ5qt8Zh0tciqsgiXFzBhuYq4of',
        Quick_Reflexes: 12.4,
        Strategic_Thinking: 19.7,
        Precision_Shots: 4.3,
        Pattern_Recognition: 8.6,
        Anticipating_Moves: 17.1,
        Board_Control: 0.9,
        Adaptive_Playstyle: 15.5,
        Risk_Management: 6.2,
        Mind_Games: 2.8
    },
    // user3
    {
        userId: 'pi07DVZqUqr82Po0NuPjnXxD5Tn',
        Quick_Reflexes: 4.6,
        Strategic_Thinking: 19.2,
        Precision_Shots: 7.1,
        Pattern_Recognition: 12.8,
        Anticipating_Moves: 0.3,
        Board_Control: 16.5,
        Adaptive_Playstyle: 2.9,
        Risk_Management: 10.4,
        Mind_Games: 8.7
    },
    // user4
    {
        userId: 'ARiX1k2UCch17pfe6hh6P0xjSCB',
        Quick_Reflexes: 17.2,
        Strategic_Thinking: 3,
        Precision_Shots: 17,
        Pattern_Recognition: 3.5,
        Anticipating_Moves: 9.1,
        Board_Control: 1,
        Adaptive_Playstyle: 15,
        Risk_Management: 7.3,
        Mind_Games: 13
    }
];
exports.ChartsData = [
    // user1 
    {
        userId: 'omKLRQY9S0LYIrVMEkgjG2c3j6k',
        game: 'pong',
        totalGamesWithAi: 887,
        gamesWithAiEasy: 61,
        gamesWithAiMedium: 423,
        gamesWithAiHard: 403,
        totalWins: 682,
        easyWins: 60,
        mediumWins: 390,
        hardWins: 232,
        friendsWins: 587,
        friendsLosses: 318,
        friendsTotalGames: 905
    },
    {
        userId: 'omKLRQY9S0LYIrVMEkgjG2c3j6k',
        game: 'parchesi',
        totalGamesWithAi: 1123,
        gamesWithAiEasy: 89,
        gamesWithAiMedium: 567,
        gamesWithAiHard: 467,
        totalWins: 824,
        easyWins: 87,
        mediumWins: 512,
        hardWins: 225,
        friendsWins: 693,
        friendsLosses: 407,
        friendsTotalGames: 1100
    },
    // user2
    {
        userId: 'KJ5qt8Zh0tciqsgiXFzBhuYq4of',
        game: 'pong',
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
    {
        userId: 'KJ5qt8Zh0tciqsgiXFzBhuYq4of',
        game: 'parchesi',
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
    },
    // user3
    {
        userId: 'pi07DVZqUqr82Po0NuPjnXxD5Tn',
        game: 'pong',
        totalGamesWithAi: 763,
        gamesWithAiEasy: 48,
        gamesWithAiMedium: 367,
        gamesWithAiHard: 348,
        totalWins: 529,
        easyWins: 47,
        mediumWins: 328,
        hardWins: 154,
        friendsWins: 412,
        friendsLosses: 284,
        friendsTotalGames: 696
    },
    {
        userId: 'pi07DVZqUqr82Po0NuPjnXxD5Tn',
        game: 'parchesi',
        totalGamesWithAi: 1054,
        gamesWithAiEasy: 94,
        gamesWithAiMedium: 508,
        gamesWithAiHard: 452,
        totalWins: 723,
        easyWins: 91,
        mediumWins: 442,
        hardWins: 190,
        friendsWins: 578,
        friendsLosses: 352,
        friendsTotalGames: 930
    },
    // user4
    {
        userId: 'ARiX1k2UCch17pfe6hh6P0xjSCB',
        game: 'pong',
        totalGamesWithAi: 842,
        gamesWithAiEasy: 67,
        gamesWithAiMedium: 417,
        gamesWithAiHard: 358,
        totalWins: 613,
        easyWins: 65,
        mediumWins: 382,
        hardWins: 166,
        friendsWins: 534,
        friendsLosses: 291,
        friendsTotalGames: 825
    },
    {
        userId: 'ARiX1k2UCch17pfe6hh6P0xjSCB',
        game: 'parchesi',
        totalGamesWithAi: 1265,
        gamesWithAiEasy: 142,
        gamesWithAiMedium: 583,
        gamesWithAiHard: 540,
        totalWins: 887,
        easyWins: 139,
        mediumWins: 528,
        hardWins: 220,
        friendsWins: 721,
        friendsLosses: 438,
        friendsTotalGames: 1159
    },
];
exports.daysDataMap = {
    'omKLRQY9S0LYIrVMEkgjG2c3j6k': omKLRQY9S0LYIrVMEkgjG2c3j6k_1.omKLRQY9S0LYIrVMEkgjG2c3j6k_DaysData,
    'KJ5qt8Zh0tciqsgiXFzBhuYq4of': KJ5qt8Zh0tciqsgiXFzBhuYq4of_1.KJ5qt8Zh0tciqsgiXFzBhuYq4of_DaysData,
    'pi07DVZqUqr82Po0NuPjnXxD5Tn': pi07DVZqUqr82Po0NuPjnXxD5Tn_1.pi07DVZqUqr82Po0NuPjnXxD5Tn_DaysData,
    'ARiX1k2UCch17pfe6hh6P0xjSCB': ARiX1k2UCch17pfe6hh6P0xjSCB_1.ARiX1k2UCch17pfe6hh6P0xjSCB_DaysData,
};
exports.chartsDataMap = {
    'omKLRQY9S0LYIrVMEkgjG2c3j6k': omKLRQY9S0LYIrVMEkgjG2c3j6k_2.omKLRQY9S0LYIrVMEkgjG2c3j6k_chartsData,
    'KJ5qt8Zh0tciqsgiXFzBhuYq4of': KJ5qt8Zh0tciqsgiXFzBhuYq4of_2.KJ5qt8Zh0tciqsgiXFzBhuYq4of_chartsData,
    'pi07DVZqUqr82Po0NuPjnXxD5Tn': pi07DVZqUqr82Po0NuPjnXxD5Tn_2.pi07DVZqUqr82Po0NuPjnXxD5Tn_chartsData,
    'ARiX1k2UCch17pfe6hh6P0xjSCB': ARiX1k2UCch17pfe6hh6P0xjSCB_2.ARiX1k2UCch17pfe6hh6P0xjSCB_chartsData,
};
exports.radarDataMap = {
    'omKLRQY9S0LYIrVMEkgjG2c3j6k': omKLRQY9S0LYIrVMEkgjG2c3j6k_3.omKLRQY9S0LYIrVMEkgjG2c3j6k_radarData,
    'KJ5qt8Zh0tciqsgiXFzBhuYq4of': KJ5qt8Zh0tciqsgiXFzBhuYq4of_3.KJ5qt8Zh0tciqsgiXFzBhuYq4of_radarData,
    'pi07DVZqUqr82Po0NuPjnXxD5Tn': pi07DVZqUqr82Po0NuPjnXxD5Tn_3.pi07DVZqUqr82Po0NuPjnXxD5Tn_radarData,
    'ARiX1k2UCch17pfe6hh6P0xjSCB': ARiX1k2UCch17pfe6hh6P0xjSCB_3.ARiX1k2UCch17pfe6hh6P0xjSCB_radarData,
};
