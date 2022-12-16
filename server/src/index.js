const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

const PORT = 3001

io.on('connection', (socket) => {
  console.log('A user connected')
})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
