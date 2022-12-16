import { PlayerAvatar } from '../components/PlayerAvatar'
import { NavBar } from '../components/NavBar'
import { Box, Button, Flex, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'

export const Lobby = () => {
  const [isHost, setIsHost] = useState(true)
  const [isReady, setIsReady] = useState(false)

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
            <PlayerAvatar name="Renan" isHost={isHost} />
            <PlayerAvatar name="Renan" isHost={!isHost} />
            <PlayerAvatar name="Renan" isHost={!isHost} />
            <PlayerAvatar name="Renan" isHost={!isHost} />
            <PlayerAvatar name="Renan" isHost={!isHost} />
            <PlayerAvatar name="Renan" isHost={!isHost} />
            <PlayerAvatar name="Renan" isHost={!isHost} />
            <PlayerAvatar name="Renan" isHost={!isHost} />
          </SimpleGrid>
        </VStack>
        <Box h={'calc(100vh - 64px)'} w={'500px'} bg={'pink'}></Box>
      </Flex>
    </Box>
  )
}
