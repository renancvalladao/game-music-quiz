import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useColorModeValue,
  VisuallyHidden,
  VStack
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useContext, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player/youtube'
import { SocketContext } from '../context/SocketContext'
import { GameHeader } from './GameHeader'
import { PlayerAnswer } from './PlayerAnswer'
import { SongInfo } from './SongInfo'
import { Standings } from './Standings'

enum GameState {
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

type PlayerStanding = {
  id: string
  name: string
  score: number
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
  const videoRef = useRef<ReactPlayer>(null)
  const socket = useContext(SocketContext)
  const bgColor = useColorModeValue('white', 'gray.700')
  const [gamesOptions, setGamesOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [gameState, setGameState] = useState<GameState>()
  const [videoUrl, setVideoUrl] = useState(undefined)
  const [canPlay, setCanPlay] = useState(false)
  const [shouldRenderValue, setShouldRenderValue] = useState(true)
  const [filter, setFilter] = useState('')
  const [answer, setAnswer] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [round, setRound] = useState(0)
  const [volume, setVolume] = useState(30)
  const [seekTo, setSeekTo] = useState(0)
  const [standings, setStandings] = useState<PlayerStanding[]>([])
  const [songDetails, setSongDetails] =
    useState<SongDetails>(EMPTY_SONG_DETAILS)
  const scrollColor = useColorModeValue('blue.400', 'blue.800')

  useEffect(() => {
    setStandings(
      room.players
        .map((player) => {
          return {
            id: player.id,
            name: player.username,
            score: player.score || 0
          }
        })
        .sort((p1, p2) => p2.score - p1.score)
    )
  }, [room])

  useEffect(() => {
    socket.on('game:song', (url, seek) => {
      setGameState(GameState.BUFFERING)
      setVideoUrl(url)
      setSeekTo(seek)
    })

    socket.on('game:play', () => {
      setCanPlay(true)
    })

    socket.on('game:checked', (correct) => {
      setIsCorrect(correct)
    })

    socket.on('game:details', (song) => {
      setSongDetails(song)
      setShowAnswer(true)
    })

    socket.on('game:finished', () => {
      setGameState(GameState.FINISHED)
    })

    socket.on('game:options', (gamesOptions: string[]) => {
      setGamesOptions(
        gamesOptions.map((gameOption) => {
          return { value: gameOption, label: gameOption }
        })
      )
    })

    return () => {
      socket.off('game:song')
      socket.off('game:play')
      socket.off('game:checked')
      socket.off('game:details')
      socket.off('game:finished')
      socket.off('game:options')
    }
  }, [socket])

  useEffect(() => {
    if (gameState === GameState.ANSWERING) {
      socket.emit('game:answer', room.id, answer)
      setFilter('')
      setShouldRenderValue(true)
      setGameState(GameState.CHECKING)
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
        <VStack spacing={'4'} pt={2}>
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
              ref={videoRef}
              url={videoUrl}
              volume={volume / (100 * 5)}
              playing={canPlay}
              onReady={() => {
                videoRef.current?.seekTo(seekTo)
                socket.emit('game:buffered', room.id)
              }}
              onStart={() => {
                const timeout = setTimeout(() => {
                  setCanPlay(false)
                  setGameState(GameState.ANSWERING)
                  setVideoUrl(undefined)
                  clearTimeout(timeout)
                }, (room.config.guessTime + 1) * 1000)
                setCountdown(room.config.guessTime)
                setGameState(GameState.PLAYING)
                setAnswer('')
                setSongDetails(EMPTY_SONG_DETAILS)
                setShowAnswer(false)
                setRound((prevRound) => prevRound + 1)
              }}
            />
          </VisuallyHidden>
          <HStack
            w={'100%'}
            justifyContent={'space-around'}
            alignItems={'start'}
          >
            <Standings standings={standings} />
            <VStack w="520px" spacing={'4'}>
              <AspectRatio w="100%" ratio={5 / 3}>
                <Box bg={bgColor} borderRadius={'md'}>
                  <Heading>
                    {gameState === GameState.PLAYING
                      ? countdown
                      : gameState === GameState.FINISHED
                      ? 'Finished'
                      : 'Waiting...'}
                  </Heading>
                </Box>
              </AspectRatio>
              <Box w={'90%'}>
                <Select
                  maxMenuHeight={175}
                  useBasicStyles
                  isReadOnly={gameState !== GameState.PLAYING}
                  placeholder="Enter game name..."
                  onChange={(value) => {
                    setShouldRenderValue(true)
                    setAnswer(value?.label || '')
                  }}
                  onInputChange={(value) => setFilter(value)}
                  inputValue={filter}
                  value={answer ? { value: answer, label: answer } : null}
                  focusBorderColor={
                    showAnswer
                      ? isCorrect
                        ? 'green.500'
                        : 'red.500'
                      : 'blue.500'
                  }
                  isInvalid={showAnswer}
                  blurInputOnSelect={true}
                  openMenuOnClick={false}
                  controlShouldRenderValue={shouldRenderValue}
                  errorBorderColor={isCorrect ? 'green.500' : 'red.500'}
                  options={
                    filter === ''
                      ? []
                      : gamesOptions.filter((option) =>
                          option.label
                            .toLowerCase()
                            .includes(filter.toLowerCase())
                        )
                  }
                  components={{ DropdownIndicator: () => <></> }}
                  onFocus={() => {
                    if (gameState === GameState.PLAYING)
                      setShouldRenderValue(false)
                  }}
                  onBlur={() => setShouldRenderValue(true)}
                  variant="filled"
                  chakraStyles={{
                    control: (provided) => ({
                      ...provided,
                      bgColor: bgColor,
                      _hover: { bg: '' },
                      _focus: { bg: bgColor }
                    })
                  }}
                />
              </Box>
            </VStack>
            <SongInfo name={songDetails.name} composer={songDetails.composer} />
          </HStack>
          <HStack
            maxW={'calc(100vw - 500px)'}
            overflowX={'auto'}
            pt={'6'}
            pb={'3'}
            sx={{
              '&::-webkit-scrollbar': {
                height: '4px'
              },
              '&::-webkit-scrollbar-track': {
                height: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: scrollColor,
                borderRadius: '24px'
              }
            }}
            spacing={'8'}
            shouldWrapChildren={true}
            alignItems={'end'}
          >
            {room.players.map((player) => (
              <PlayerAnswer
                key={player.id}
                username={player.username}
                answer={!showAnswer ? '?' : player.answer || '...'}
              />
            ))}
          </HStack>
        </VStack>
      )}
    </>
  )
}
