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
  round: number
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
  username: string
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

const PORT = process.env.PORT || 3001
const SONG_PARTS = 3

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://game-music-quiz.netlify.app']
  }
})

const rooms: Room[] = []

const getRandomSong = (games: Game[]) => {
  const game = games[Math.floor(Math.random() * games.length)]
  const song = game.songs[Math.floor(Math.random() * game.songs.length)]
  return { game: game.details, song }
}

const leaveRoom = (room: Room, playerId: string) => {
  const roomId = room.id
  room.players = room.players.filter((player) => player.id !== playerId)
  if (room.players.length === 0) {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === roomId) {
        rooms.splice(i, 1)
        break
      }
    }
    io.emit('room:closed', roomId)
    return
  }
  io.emit('room:left', { roomId, playerId })
  if (room.host === playerId) {
    room.host = room.players[0].id
    room.players[0].ready = true
    io.emit('room:host', { roomId, newHostId: room.host })
  }
}

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`)
  let playerId = socket.handshake.auth.playerId
  if (!playerId) {
    playerId = randomUUID()
    socket.emit('socket:playerId', playerId)
  }
  let username = socket.handshake.auth.username || playerId

  rooms.forEach((room) => {
    if (room.players.some((p) => p.id === playerId)) {
      socket.join(room.id)
    }
  })

  socket.on('username:change', (newUsername) => {
    username = newUsername
    socket.emit('socket:username', newUsername)
    const myRooms = rooms.filter((room) => socket.rooms.has(room.id))
    myRooms.forEach((room) => {
      room.players.forEach((player) => {
        if (player.id === playerId) {
          player.username = newUsername
          io.emit('username:changed', room.id, playerId, newUsername)
        }
      })
    })
  })

  socket.on('room:list', (callback) => {
    callback({ data: rooms })
  })

  socket.on('room:create', ({ name, config }, callback) => {
    const roomId = randomUUID()
    const room = {
      id: roomId,
      name,
      host: playerId,
      players: [
        {
          id: playerId,
          username,
          ready: true,
          buffered: false,
          answered: false,
          score: 0
        }
      ],
      playing: false,
      round: 0,
      config
    }
    rooms.unshift(room)

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

    if (room.playing) {
      // TODO: ALREADY PLAYING
      return
    }

    if (room.config.capacity === room.players.length) {
      // TODO: FULL
      return
    }

    socket.join(roomId)

    if (playerId === room.host) {
      callback(room)
      return
    }

    const [player] = room.players.filter((p) => p.id === playerId)
    if (!player) {
      room.players.push({
        id: playerId,
        username,
        ready: playerId === room.host ? true : false,
        buffered: false,
        answered: false,
        score: 0
      })
      callback(room)
      io.emit('room:joined', roomId, { playerId, username })
    }
  })

  socket.on('room:leave', (roomId) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    socket.leave(roomId)
    leaveRoom(room, playerId)
  })

  socket.on('room:ready', (roomId) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    const [player] = room.players.filter((p) => p.id === playerId)
    if (!player) {
      // TODO: ERROR
      return
    }

    player.ready = true
    io.to(roomId).emit('player:ready', playerId)
  })

  socket.on('room:unready', (roomId) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    const [player] = room.players.filter((p) => p.id === playerId)
    if (!player) {
      // TODO: ERROR
      return
    }

    player.ready = false
    io.to(roomId).emit('player:unready', playerId)
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
      const gamesOptions = games.map((game) => game.details.title).sort()
      io.to(roomId).emit('game:options', gamesOptions)
      room.round++
      const { game, song } = getRandomSong(games)
      room.song = {
        gameTitle: game.title,
        composer: game.composer,
        name: song.name
      }
      const seek = Math.floor(Math.random() * SONG_PARTS) * (1 / SONG_PARTS)
      io.to(roomId).emit('game:song', song.url, seek)
    }
  })

  socket.on('game:buffered', (roomId) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    const [player] = room.players.filter((p) => p.id === playerId)
    if (!player) {
      // TODO: ERROR
      return
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
    const [player] = room.players.filter((p) => p.id === playerId)
    if (!player) {
      // TODO: ERROR
      return
    }
    let correct
    if (answer.toLowerCase() === room.song?.gameTitle.toLowerCase()) {
      correct = true
      player.score++
    } else {
      correct = false
    }
    player.answered = true
    socket.emit('game:checked', correct)
    if (room.players.filter((p) => !p.answered).length === 0) {
      room.players.forEach((p) => (p.answered = false))
      io.to(roomId).emit('game:details', room.song)
      io.to(roomId).emit(
        'room:standings',
        [...room.players].sort((p1, p2) => p2.score - p1.score)
      )
      if (room.round === room.config.songs) {
        io.to(roomId).emit('game:finished')
      } else {
        const timeout = setTimeout(() => {
          room.round++
          const { game, song } = getRandomSong(games)
          room.song = {
            gameTitle: game.title,
            composer: game.composer,
            name: song.name
          }
          const seek = Math.floor(Math.random() * SONG_PARTS) * (1 / SONG_PARTS)
          io.to(roomId).emit('game:song', song.url, seek)
          clearTimeout(timeout)
        }, 5 * 1000)
      }
    }
  })

  socket.on('message:send', (roomId, message) => {
    io.to(roomId).emit('message:received', playerId, message)
  })
})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
