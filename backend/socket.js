let io;

function setupSocket(serverIO) {
  io = serverIO;
  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });
  });
}

function emitNotification(userId, notification) {
  
  if (io) {
    io.to(userId).emit('notification', notification);
  }
}

module.exports = { setupSocket, emitNotification };