// export const host = 'http://localhost:5000';
const hostIp: string = "localhost";
export const host = `http://${hostIp}:5003`;

export const ApiRoutes = {

  // routes chat service
  ListFriends: `${host}/api/chat/friends`,
  sendMessage: `${host}/api/chat/addmsg`,
  getMessages: `${host}/api/chat/getmsgs`,
  sendFile: `${host}/api/chat/sendfile`,
  getFile: `${host}/api/chat/uploads/`,
  blockUser: `${host}/api/chat/blockuser`,
  unblockUser: `${host}/api/chat/unblockuser`,
  // end routes chat service
};