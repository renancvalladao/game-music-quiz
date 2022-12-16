import { PlayerAvatar } from '../components/PlayerAvatar'
import { NavBar } from '../components/NavBar'
import { Box, Button, Flex, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'

export const Lobby = () => {
  const { roomId } = useParams()
  const socket = useContext(SocketContext)
  const [isReady, setIsReady] = useState(false)
  const [room, setRoom] = useState<Room | null>(null)
  const isHost = socket.id === room?.host

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
        <VStack w={'100%'} px={64} pt={8} spacing={8}>
          {isHost ? (
            <Button colorScheme="green" size="lg" py={8} w={'180px'}>
              <Text fontSize={'2xl'}>Start</Text>
            </Button>
          ) : isReady ? (
            <Button
              onClick={() => setIsReady(false)}
              colorScheme="red"
              size="lg"
              py={8}
              w={'180px'}
            >
              <Text fontSize={'2xl'}>Unready</Text>
            </Button>
          ) : (
            <Button
              onClick={() => setIsReady(true)}
              colorScheme="green"
              size="lg"
              py={8}
              w={'180px'}
            >
              <Text fontSize={'2xl'}>Ready</Text>
            </Button>
          )}
          <SimpleGrid
            spacing={6}
            templateColumns="repeat(auto-fill, minmax(272px, 1fr))"
            w={'100%'}
          >
            {room?.players.map((player) => (
              <PlayerAvatar
                key={player}
                name={player}
                isHost={player === room.host}
              />
            ))}
          </SimpleGrid>
        </VStack>
        <Box h={'calc(100vh - 64px)'} w={'500px'} bg={'pink'}></Box>
      </Flex>
    </Box>
  )
}
