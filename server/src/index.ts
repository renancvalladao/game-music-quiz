import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { randomUUID } from 'crypto'
import games from './games'

type Room = {
  id: string
  name: string
  host: string
  players: Player[]
  playing: boolean
  config: {
    songs: number
    guessTime: number
    capacity: number
  }
  song?: {
    gameTitle: string
    name: string
    composer: string
  }
}

type Player = {
  id: string
  ready: boolean
  buffered: boolean
  answered: boolean
  score: number
}

type Game = {
  details: {
    title: string
    composer: string
  }
  songs: {
    name: string
    url: string
  }[]
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

const getRandomSong = (games: Game[]) => {
  const game = games[Math.floor(Math.random() * games.length)]
  const song = game.songs[Math.floor(Math.random() * game.songs.length)]
  return { game: game.details, song }
}

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
    // TODO: can get room from socket
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    if (room.config.capacity === room.players.length) {
      // TODO: FULL
      return
    }
    const [player] = room.players.filter((p) => p.id === socket.id)
    if (!player) {
      socket.join(roomId)
      room.players.push({
        id: socket.id,
        ready: socket.id === room.host ? true : false,
        buffered: false,
        answered: false,
        score: 0
      })
      callback(room)
      io.emit('room:joined', { roomId, playerId: socket.id })
    }
  })

  socket.on('room:ready', (roomId) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    const [player] = room.players.filter((p) => p.id === socket.id)
    if (!player) {
      // ERROR
    }

    player.ready = true
    io.to(roomId).emit('player:ready', socket.id)
  })

  socket.on('room:unready', (roomId) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    const [player] = room.players.filter((p) => p.id === socket.id)
    if (!player) {
      // ERROR
    }

    player.ready = false
    io.to(roomId).emit('player:unready', socket.id)
  })

  socket.on('room:start', (roomId) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    if (room.players.filter((p) => !p.ready).length === 0 && !room.playing) {
      room.playing = true
      io.emit('room:started', roomId)
      const { game, song } = getRandomSong(games)
      room.song = {
        gameTitle: game.title,
        composer: game.composer,
        name: song.name
      }
      io.to(roomId).emit('game:url', song.url)
    }
  })

  socket.on('game:buffered', (roomId) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    const [player] = room.players.filter((p) => p.id === socket.id)
    if (!player) {
      // ERROR
    }
    player.buffered = true
    if (room.players.filter((p) => !p.buffered).length === 0) {
      room.players.forEach((p) => (p.buffered = false))
      io.to(roomId).emit('game:play')
    }
  })

  socket.on('game:answer', (roomId, answer) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }
    const [player] = room.players.filter((p) => p.id === socket.id)
    if (!player) {
      // ERROR
    }
    let correct
    if (answer === room.song?.gameTitle) {
      correct = true
      player.score++
    } else {
      correct = false
    }
    player.answered = true
    if (room.players.filter((p) => !p.answered).length === 0) {
      room.players.forEach((p) => (p.answered = false))
      io.to(roomId).emit('game:checked', {
        song: room.song,
        correct,
        newStandings: room.players.map((player) => {
          return {
            name: player.id,
            score: player.score
          }
        })
      })
      setTimeout(() => {
        const { game, song } = getRandomSong(games)
        room.song = {
          gameTitle: game.title,
          composer: game.composer,
          name: song.name
        }
        io.to(roomId).emit('game:url', song.url)
      }, 5 * 1000)
    }
  })
})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
