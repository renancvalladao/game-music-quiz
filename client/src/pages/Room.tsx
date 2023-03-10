import { NavBar } from '../components/NavBar'
import { Box, Center, Flex, Spinner } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import { Lobby } from '../components/Lobby'
import { InGame } from '../components/InGame'
import { Chat } from '../components/Chat'

export const Room = () => {
  const { roomId } = useParams()
  const socket = useContext(SocketContext)
  const [room, setRoom] = useState<Room | null>(null)

  useEffect(() => {
    const onUnload = () => {
      socket.emit('room:leave', roomId)
    }

    window.addEventListener('unload', onUnload)
    return () => {
      window.removeEventListener('unload', onUnload)
    }
  }, [roomId, socket])

  useEffect(() => {
    socket.emit('room:join', roomId, (room: Room) => {
      setRoom(room)
    })

    socket.on('room:joined', (roomId, { playerId, username }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null
        if (prevRoom.id === roomId) {
          if (!prevRoom.players.some((player) => player.id === playerId)) {
            prevRoom.players.push({ id: playerId, username, ready: false })
          }
        }

        return { ...prevRoom }
      })
    })

    socket.on('room:left', ({ roomId, playerId }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null
        if (prevRoom.id === roomId) {
          prevRoom.players = prevRoom.players.filter(
            (player) => player.id !== playerId
          )
        }

        return { ...prevRoom }
      })
    })

    socket.on('room:host', ({ roomId, newHostId }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null
        if (prevRoom.id === roomId) {
          prevRoom.host = newHostId
          const newHost = prevRoom.players.filter(
            (player) => player.id === newHostId
          )[0]
          newHost.ready = true
        }

        return { ...prevRoom }
      })
    })

    socket.on('room:started', (roomId) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null
        if (prevRoom.id === roomId) {
          prevRoom.playing = true
        }

        return { ...prevRoom }
      })
    })

    socket.on('room:standings', (players) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null
        prevRoom.players = players

        return { ...prevRoom }
      })
    })

    socket.on('player:ready', (playerId) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null
        if (prevRoom.id === roomId) {
          const [player] = prevRoom.players.filter((p) => p.id === playerId)
          player.ready = true
        }

        return { ...prevRoom }
      })
    })

    socket.on('player:unready', (playerId) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null
        if (prevRoom.id === roomId) {
          const [player] = prevRoom.players.filter((p) => p.id === playerId)
          player.ready = false
        }

        return { ...prevRoom }
      })
    })

    socket.on('username:changed', (roomId, playerId, newUsername) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null

        if (prevRoom.id === roomId) {
          prevRoom.players.forEach((player) => {
            if (player.id === playerId) player.username = newUsername
          })
        }

        return { ...prevRoom }
      })
    })

    socket.on('room:finished', (roomId) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null

        if (prevRoom.id !== roomId) return prevRoom
        prevRoom.playing = false
        prevRoom.players.forEach((player) => {
          player.ready = player.id === prevRoom.host ? true : false
          player.score = 0
        })

        return { ...prevRoom }
      })
    })

    return () => {
      socket.emit('room:leave', roomId)
      socket.off('room:joined')
      socket.off('room:left')
      socket.off('room:host')
      socket.off('room:started')
      socket.off('room:standings')
      socket.off('player:ready')
      socket.off('player:unready')
      socket.off('username:changed')
      socket.off('room:finished')
    }
  }, [socket, roomId])

  return (
    <Box>
      <NavBar />
      <Flex>
        {!room ? (
          <Center w={'100%'} pt={8}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Center>
        ) : (
          <>
            <Box w={'100%'}>
              {room.playing ? <InGame room={room} /> : <Lobby room={room} />}
            </Box>
            <Chat room={room} />
          </>
        )}
      </Flex>
    </Box>
  )
}
