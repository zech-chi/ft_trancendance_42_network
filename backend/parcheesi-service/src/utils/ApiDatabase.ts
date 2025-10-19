const host = "http://db-service:5000";

export const ApidataBase = {
     // routes Parchisi service
    SetstartGame: `${host}/api/Parchisi/startGame`,
    SetendGame: `${host}/api/Parchisi/end/:id`,
    getGameid: `${host}/api/Parchisi/game/:id`,
    getUsergames: `${host}/api/Parchisi/user/:username/games`,
    // end routes Parchisi service
}