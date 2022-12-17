import { Button, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { PlayerAvatar } from './PlayerAvatar'

type LobbyProps = {
  room: Room | null
  socketId: string
}

export const Lobby = ({ room, socketId }: LobbyProps) => {
  const [isReady, setIsReady] = useState(false)
  const isHost = socketId === room?.host

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
