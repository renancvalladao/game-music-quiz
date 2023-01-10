import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { randomUUID } from 'crypto'
import { getAllGames, getRandomSong, getSongsByGameId } from './db'
import cors from 'cors'

const PORT = process.env.PORT || 3001
const SONG_PARTS = 3

const app = express()
app.use(
  cors({
    origin: [process.env.APP || 'http://localhost:3000']
  })
)
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: [process.env.APP || 'http://localhost:3000']
  }
})

const rooms: Room[] = []

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
    console.log(`=> [Room ${roomId}] Room closed`)
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
  console.log(`=> User ${socket.id} connected`)

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
    console.log('=> Room created:')
    console.log(room)
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
      console.log(
        `=> [Room ${roomId}] Player joined {id: ${playerId}, username: ${username}}`
      )
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
    console.log(
      `=> [Room ${roomId}] Player left {id: ${playerId}, username: ${username}}`
    )
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

  socket.on('room:start', async (roomId) => {
    const [room] = rooms.filter((room) => room.id === roomId)
    if (!room) {
      // TODO: ERROR
      return
    }

    if (room.players.filter((p) => !p.ready).length === 0 && !room.playing) {
      room.playing = true
      io.emit('room:started', roomId)
      console.log(`=> [Room ${roomId}] Game started`)
      const gamesOptions = (await getAllGames()).map((game) => game.name)
      io.to(roomId).emit('game:options', gamesOptions)
      room.round++
      const randomSong = await getRandomSong()
      room.song = {
        gameTitle: randomSong.game_name,
        composer: randomSong.song_composer,
        name: randomSong.song_name,
        alternativeAnswers: randomSong.alternative_answers
      }
      const seek = Math.floor(Math.random() * SONG_PARTS) * (1 / SONG_PARTS)
      io.to(roomId).emit('game:song', randomSong.song_video_url, seek)
      console.log(
        `=> [Room ${roomId}] Sending song ${randomSong.song_name} (${randomSong.game_name})`
      )
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
    console.log(
      `=> [Room ${roomId}] Player buffered {id: ${playerId}, username: ${username}}`
    )
    if (room.players.filter((p) => !p.buffered).length === 0) {
      room.players.forEach((p) => (p.buffered = false))
      io.to(roomId).emit('game:play')
      console.log(`=> [Room ${roomId}] All players buffered`)
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
    if (
      answer === room.song?.gameTitle ||
      room.song?.alternativeAnswers.includes(answer)
    ) {
      correct = true
      player.score++
    } else {
      correct = false
    }
    player.answer = answer
    player.answered = true
    socket.emit('game:checked', correct)
    console.log(
      `=> [Room ${roomId}] Player answered {id: ${playerId}, username: ${username}}`
    )
    if (room.players.filter((p) => !p.answered).length === 0) {
      room.players.forEach((p) => (p.answered = false))
      console.log(`=> [Room ${roomId}] All players answered`)
      io.to(roomId).emit('game:details', room.song)
      io.to(roomId).emit('room:standings', room.players)
      if (room.round === room.config.songs) {
        io.to(roomId).emit('game:finished')
        console.log(`=> [Room ${roomId}] Game finished`)
        setTimeout(() => {
          room.playing = false
          room.players.forEach((player) => {
            player.answered = false
            player.buffered = false
            player.ready = player.id === room.host ? true : false
            player.score = 0
          })
          room.round = 0
          io.emit('room:finished', roomId)
        }, 5000)
      } else {
        const timeout = setTimeout(async () => {
          room.round++
          const randomSong = await getRandomSong()
          room.song = {
            gameTitle: randomSong.game_name,
            composer: randomSong.song_composer,
            name: randomSong.song_name,
            alternativeAnswers: randomSong.alternative_answers
          }
          const seek = Math.floor(Math.random() * SONG_PARTS) * (1 / SONG_PARTS)
          io.to(roomId).emit('game:song', randomSong.song_video_url, seek)
          console.log(
            `=> [Room ${roomId}] Sending song ${randomSong.song_name} (${randomSong.game_name})`
          )
          clearTimeout(timeout)
        }, 5 * 1000)
      }
    }
  })

  socket.on('message:send', (roomId, message) => {
    io.to(roomId).emit('message:received', playerId, message)
  })
})

app.get('/games', async (_req, res) => {
  const games = await getAllGames()
  res.json(games)
})

app.get('/songs/:gameId', async (req, res) => {
  const gameId = req.params.gameId
  const songs = await getSongsByGameId(gameId)
  res.json(songs)
})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
