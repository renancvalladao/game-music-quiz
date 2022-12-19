import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { randomUUID } from 'crypto'

type Room = {
  id: string
  name: string
  host: string
  players: string[]
  playing: boolean
  config: {
    songs: number
    guessTime: number
    capacity: number
  }
}

const PORT = 3001

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

const rooms: Room[] = []

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`)

  socket.on('room:list', (callback) => {
    callback({ data: rooms })
  })

  socket.on('room:create', ({ name, config }, callback) => {
    const roomId = randomUUID()
    const room = {
      id: roomId,
      name,
      host: socket.id,
      players: [],
      playing: false,
      config
    }
    rooms.push(room)

    io.emit('room:created', room)
    callback(roomId)
  })

  socket.on('room:join', (roomId, callback) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    if (room.config.capacity === room.players.length) {
      // TODO: FULL
      return
    }

    if (!room.players.includes(socket.id)) {
      socket.join(roomId)
      room.players.push(socket.id)
    }

    callback(room)
    io.emit('room:joined', { roomId, playerId: socket.id })
  })

  socket.on('room:start', (roomId) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    room.playing = true
    io.emit('room:started', roomId)
  })
})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
