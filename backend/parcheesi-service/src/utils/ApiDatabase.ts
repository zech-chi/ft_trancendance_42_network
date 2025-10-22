const host = "http://db-service:5000";

export const ApidataBase = {
     // routes Parchisi service
    SetstartGame: `${host}/api/parchisi/startGame`,
    SetendGame: `${host}/api/parchisi/end`,
    getGameid: `${host}/api/parchisi/game/:`,
    getUsergames: `${host}/api/parchisi/user/:username/games`,
    getuserdata: `${host}/api/dashboard/users/`,
    // end routes Parchisi service
}