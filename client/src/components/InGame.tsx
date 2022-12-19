import {
  AspectRatio,
  HStack,
  Image,
  Input,
  VisuallyHidden,
  VStack
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { SocketContext } from '../context/SocketContext'
import { GameHeader } from './GameHeader'
import { SongInfo } from './SongInfo'
import { Standings } from './Standings'

type InGameProps = {
  room: Room
}

export const InGame = ({ room }: InGameProps) => {
  const socket = useContext(SocketContext)
  const [videoUrl, setVideoUrl] = useState('')
  const [canPlay, setCanPlay] = useState(false)
  const [standings, setStandings] = useState(
    room.players.map((player) => {
      return { name: player.id, score: 0 }
    })
  )
  const playedSongs = 5

  useEffect(() => {
    socket.on('game:url', (url) => {
      setVideoUrl(url)
    })

    socket.on('game:play', () => {
      setCanPlay(true)
    })

    return () => {
      socket.off('game:url')
      socket.off('game:play')
    }
  }, [socket])

  return (
    <>
      {room.playing && (
        <VStack spacing={'24px'}>
          <GameHeader
            totalSongs={room.config.songs}
            playedSongs={playedSongs}
            gameTitle={'Chrono Trigger'}
          />
          <VisuallyHidden>
            <ReactPlayer
              url={videoUrl}
              volume={0.1}
              playing={canPlay}
              onReady={() => {
                socket.emit('game:buffered', room.id)
              }}
            />
          </VisuallyHidden>
          <HStack
            w={'100%'}
            justifyContent={'space-around'}
            alignItems={'start'}
          >
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
      )}
    </>
  )
}
