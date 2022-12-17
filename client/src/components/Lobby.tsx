import { Button, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { SocketContext } from '../context/SocketContext'
import { PlayerAvatar } from './PlayerAvatar'

type LobbyProps = {
  room: Room | null
}

export const Lobby = ({ room }: LobbyProps) => {
  const socket = useContext(SocketContext)
  const [isReady, setIsReady] = useState(false)
  const isHost = socket.id === room?.host

  return (
    <VStack px={64} spacing={8}>
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
  )
}
