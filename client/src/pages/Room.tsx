import { NavBar } from '../components/NavBar'
import { Box, Flex } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import { Lobby } from '../components/Lobby'

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
          if (!prevRoom.players.includes(playerId)) {
            prevRoom.players.push(playerId)
          }
        }

        return { ...prevRoom }
      })
    })

    return () => {
      socket.off('room:joined')
    }
  }, [socket, roomId])

  return (
    <Box>
      <NavBar />
      <Flex>
        <Lobby room={room} socketId={socket.id} />
        <Box h={'calc(100vh - 64px)'} w={'500px'} bg={'pink'}></Box>
      </Flex>
    </Box>
  )
}
