const {Server} = require("socket.io")
const http = require("http")
const express = require("express")
const socketAuthUser = require("./middlewares/socketAuthUser")
const { GET_ONLINE_USERS } = require("./utils/events")
const dotenv = require("dotenv")

dotenv.config({path:"./.env"})

const app = express()
const server = http.createServer(app)// http server


// socket server
const io = new Server(
        server,
        {
                cors:{
                        origin:[process.env.FRONTEND_BASE_URL],
                        credentials:true
                }
        }
)


// socket middleware for authentication
io.use(socketAuthUser)

function getReceiverSocketId(userId){
        return userSocketMap.get(userId)
}

const userSocketMap = new Map() //{userId:socketId}

io.on('connection',async(socket)=>{

        console.log(`Socket connected established: ${socket.user?.name} (${socket.userId})`);

        userSocketMap.set(socket.userId,socket.id)

        // listening to the events

        // send events 
        // io.emit() // to everyone
        // io.to(socketId).emit() // to particular socket
        io.emit(GET_ONLINE_USERS,Array.from(userSocketMap.keys()))


        // disconnect

        socket.on('disconnect',async()=>{
                console.log(`Socket disconnected: ${socket.user?.name} (${socket.userId})`);
                userSocketMap.delete(socket.userId)
                io.emit(GET_ONLINE_USERS,Array.from(userSocketMap.keys()))
        })
})

module.exports = {
        io,
        app,
        server,
        getReceiverSocketId
}