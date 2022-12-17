import { AspectRatio, HStack, Image, Input, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { GameHeader } from './GameHeader'
import { SongInfo } from './SongInfo'
import { Standings } from './Standings'

type InGameProps = {
  room: Room
}

export const InGame = ({ room }: InGameProps) => {
  const [standings, setStandings] = useState(
    room.players.map((player) => {
      return { name: player, score: 0 }
    })
  )
  const playedSongs = 5

  return (
    <VStack spacing={'24px'}>
      <GameHeader
        totalSongs={room.config.songs}
        playedSongs={playedSongs}
        gameTitle={'Chrono Trigger'}
      />
      <HStack w={'100%'} justifyContent={'space-around'} alignItems={'start'}>
        <Standings standings={standings} />
        <VStack>
          <AspectRatio w="520px" ratio={4 / 3}>
            <Image
              borderRadius="5px"
              src="https://i.pinimg.com/736x/01/80/4f/01804fbee0d38d7302214f9dd910bfec.jpg"
              alt="Chrono Trigger Cover"
              objectFit="cover"
            />
          </AspectRatio>
          <Input w={'90%'}></Input>
        </VStack>
        <SongInfo />
      </HStack>
    </VStack>
  )
}
