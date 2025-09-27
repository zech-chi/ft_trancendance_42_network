const host = "http://127.0.0.1:5000";

export const ApidataBase = {
     // routes chat service
    checkUser: `${host}/api/chat/checkuser`,
    getFriends: `${host}/api/chat/friends`,
    areFriends: `${host}/api/chat/arefriends`,
    addMsg: `${host}/api/chat/addmsg`,
    getMsgs: `${host}/api/chat/getmsgs`,
    blockUser: `${host}/api/chat/blockuser`,
    unblockUser: `${host}/api/chat/unblockuser`,
    canUnblock: `${host}/api/chat/canunblock`,
    checkMesg: `${host}/api/chat/checkMesg`,
    deleteMsg: `${host}/api/chat/deletemsg`,
    editMsg: `${host}/api/chat/editmsg`,
    addFileMsg: `${host}/api/chat/addfilemsg`,
    hello: `${host}/api/chat/hello`,
    // end routes chat service
}