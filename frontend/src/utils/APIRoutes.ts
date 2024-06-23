const host: string = "http://localhost:8008";
const registerRoute = `${host}/api/auth/register`;
const loginRoute = `${host}/api/auth/login`;
const setAvatarRoute = `${host}/api/auth/setAvatar`;
const allUsersRoute = `${host}/api/auth/allUsers`;
const sendMessageRoute = `${host}/api/messages/addMessage`;
const getAllMessagesRoute = `${host}/api/messages/getAllMessages`;
export {
  host,
  registerRoute,
  loginRoute,
  setAvatarRoute,
  allUsersRoute,
  sendMessageRoute,
  getAllMessagesRoute,
};
