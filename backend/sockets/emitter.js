let socketServer = null;

export function setSocketServer(io) {
  socketServer = io;
}

export function userRoom(userId) {
  return `user:${userId.toString()}`;
}

export function emitToUsers(userIds, event, payload) {
  if (!socketServer) return;
  const rooms = [...new Set(userIds.map((id) => userRoom(id)))];
  socketServer.to(rooms).emit(event, payload);
}
