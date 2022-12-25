import { NavBar } from '../components/NavBar'
import { Box, Flex } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import { Lobby } from '../components/Lobby'
import { InGame } from '../components/InGame'

export const Room = () => {
  const { roomId } = useParams()
  const socket = useContext(SocketContext)
  const [room, setRoom] = useState<Room | null>(null)

  useEffect(() => {
    socket.emit('room:join', roomId, (room: Room) => {
      setRoom(room)
    })

    socket.on('room:joined', ({ roomId, playerId }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null
        if (prevRoom.id === roomId) {
          if (!prevRoom.players.some((player) => player.id === playerId)) {
            prevRoom.players.push({ id: playerId, ready: false })
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

    return () => {
      socket.emit('room:leave', roomId)
      socket.off('room:joined')
      socket.off('room:left')
      socket.off('room:host')
      socket.off('room:started')
      socket.off('room:standings')
      socket.off('player:ready')
      socket.off('player:unready')
    }
  }, [socket, roomId])

  return (
    <Box>
      <NavBar />
      <Flex>
        <Box w={'100%'} pt={8}>
          {!room ? (
            <div>Loading</div>
          ) : (
            <>
              <InGame room={room} />
              <Lobby room={room} />
            </>
          )}
        </Box>
        <Box h={'calc(100vh - 64px)'} w={'500px'} bg={'pink'}></Box>
      </Flex>
    </Box>
  )
}
