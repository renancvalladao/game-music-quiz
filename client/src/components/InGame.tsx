import {
  AspectRatio,
  Box,
  Heading,
  HStack,
  Image,
  Input,
  useColorModeValue,
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
  const bgColor = useColorModeValue('gray.100', 'gray.900')
  const [videoUrl, setVideoUrl] = useState('')
  const [canPlay, setCanPlay] = useState(false)
  const [answer, setAnswer] = useState('')
  const [countdown, setCountdown] = useState(0)
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

  useEffect(() => {
    let timer: NodeJS.Timer
    if (countdown > 0) {
      timer = setInterval(
        () => setCountdown((prevCountDown) => prevCountDown - 1),
        1000
      )
    }
    return () => clearInterval(timer)
  }, [countdown])

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
              onStart={() => {
                setTimeout(() => {
                  setCanPlay(false)
                }, (room.config.guessTime + 1) * 1000)
                setCountdown(room.config.guessTime)
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
                <Box bg={bgColor}>
                  <Heading>{countdown}</Heading>
                </Box>
                {/* <Image
                  borderRadius="5px"
                  src="https://i.pinimg.com/736x/01/80/4f/01804fbee0d38d7302214f9dd910bfec.jpg"
                  alt="Chrono Trigger Cover"
                  objectFit="cover"
                /> */}
              </AspectRatio>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                w={'90%'}
              ></Input>
            </VStack>
            <SongInfo />
          </HStack>
        </VStack>
      )}
    </>
  )
}
