// export const host = 'http://localhost:5000';
const hostIp: string = "localhost";
export const host = `http://${hostIp}:5006`;

export const ApiRoutes = {

  // routes chat service
  ListFriends: `/api/chat/friends`,
  sendMessage: `/api/chat/addmsg`,
  getMessages: `/api/chat/getmsgs`,
  sendFile: `/api/chat/sendfile`,
  getFile: `/api/chat/uploads/`,
  blockUser: `/api/chat/blockuser`,
  unblockUser: `/api/chat/unblockuser`,
  // end routes chat service
};