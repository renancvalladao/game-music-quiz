import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
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

enum State {
  BUFFERING,
  PLAYING,
  ANSWERING,
  CHECKING,
  FINISHED
}

type SongDetails = {
  gameTitle: string
  name: string
  composer: string
}

type InGameProps = {
  room: Room
}

const EMPTY_SONG_DETAILS = {
  gameTitle: '?',
  name: '?',
  composer: '?'
}

export const InGame = ({ room }: InGameProps) => {
  const socket = useContext(SocketContext)
  const bgColor = useColorModeValue('gray.100', 'gray.900')
  const [gameState, setGameState] = useState<State>()
  const [videoUrl, setVideoUrl] = useState('')
  const [canPlay, setCanPlay] = useState(false)
  const [answer, setAnswer] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showBorder, setShowBorder] = useState(false)
  const [round, setRound] = useState(0)
  const [volume, setVolume] = useState(10)
  const [songDetails, setSongDetails] =
    useState<SongDetails>(EMPTY_SONG_DETAILS)
  const [standings, setStandings] = useState<{ name: string; score: number }[]>(
    []
  )

  useEffect(() => {
    setStandings(
      room.players.map((player) => {
        return { name: player.id, score: 0 }
      })
    )
  }, [room])

  useEffect(() => {
    socket.on('game:url', (url) => {
      setGameState(State.BUFFERING)
      setVideoUrl(url)
    })

    socket.on('game:play', () => {
      setCanPlay(true)
    })

    socket.on('game:checked', (correct) => {
      setIsCorrect(correct)
    })

    socket.on('game:details', ({ song, newStandings }) => {
      setSongDetails(song)
      setStandings(newStandings)
      setShowBorder(true)
    })

    socket.on('game:finished', () => {
      setGameState(State.FINISHED)
    })

    return () => {
      socket.off('game:url')
      socket.off('game:play')
      socket.off('game:checked')
      socket.off('game:details')
      socket.off('game:finished')
    }
  }, [socket])

  useEffect(() => {
    if (gameState === State.ANSWERING) {
      socket.emit('game:answer', room.id, answer)
      setGameState(State.CHECKING)
    }
  }, [gameState, answer, socket, room.id])

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
          <Flex w={'95%'} justifyContent={'end'}>
            <Slider
              w={'32'}
              value={volume}
              onChange={(value) => {
                setVolume(value)
              }}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Flex>
          <GameHeader
            totalSongs={room.config.songs}
            playedSongs={round}
            gameTitle={songDetails.gameTitle}
          />
          <VisuallyHidden>
            <ReactPlayer
              url={videoUrl}
              volume={volume / 100}
              playing={canPlay}
              onReady={() => {
                socket.emit('game:buffered', room.id)
              }}
              onStart={() => {
                setCountdown(room.config.guessTime)
                setGameState(State.PLAYING)
                setAnswer('')
                setSongDetails(EMPTY_SONG_DETAILS)
                setShowBorder(false)
                setRound((prevRound) => prevRound + 1)
                setTimeout(() => {
                  setCanPlay(false)
                  setVideoUrl('')
                  setGameState(State.ANSWERING)
                }, (room.config.guessTime + 1) * 1000)
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
                  <Heading>
                    {gameState === State.PLAYING
                      ? countdown
                      : gameState === State.FINISHED
                      ? 'Finished'
                      : 'Waiting...'}
                  </Heading>
                </Box>
              </AspectRatio>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                w={'90%'}
                isInvalid={showBorder}
                focusBorderColor={
                  gameState === State.CHECKING
                    ? isCorrect
                      ? 'green.500'
                      : 'red.500'
                    : 'blue.500'
                }
                errorBorderColor={isCorrect ? 'green.500' : 'red.500'}
              />
            </VStack>
            <SongInfo name={songDetails.name} composer={songDetails.composer} />
          </HStack>
        </VStack>
      )}
    </>
  )
}
