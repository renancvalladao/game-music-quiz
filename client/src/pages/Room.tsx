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

    socket.on('room:started', (roomId) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null
        if (prevRoom.id === roomId) {
          prevRoom.playing = true
        }

        return { ...prevRoom }
      })
    })

    return () => {
      socket.off('room:joined')
      socket.off('room:started')
    }
  }, [socket, roomId])

  return (
    <Box>
      <NavBar />
      <Flex>
        <Box w={'100%'} pt={8}>
          {!room ? (
            <div>Loading</div>
          ) : room.playing ? (
            <InGame room={room} />
          ) : (
            <Lobby room={room} />
          )}
        </Box>
        <Box h={'calc(100vh - 64px)'} w={'500px'} bg={'pink'}></Box>
      </Flex>
    </Box>
  )
}
