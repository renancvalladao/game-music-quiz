const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { randomUUID } = require('crypto')

const PORT = 3001

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

const rooms = []

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`)

  socket.on('room:list', (callback) => {
    callback({ data: rooms })
  })

  socket.on('room:create', ({ name, host, config }) => {
    const room = { id: randomUUID(), name, host, players: 1, config }
    rooms.push(room)

    io.emit('room:created', room)
  })
})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
