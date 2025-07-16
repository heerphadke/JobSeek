import { Server } from "socket.io";

export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected", socket.id);

      socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
      });
    });
  }
  res.end();
}
