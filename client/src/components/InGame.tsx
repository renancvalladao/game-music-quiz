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
  const videoRef = useRef<ReactPlayer>(null)
  const socket = useContext(SocketContext)
  const bgColor = useColorModeValue('gray.100', 'gray.900')
  const [gamesOptions, setGamesOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [gameState, setGameState] = useState<State>()
  const [videoUrl, setVideoUrl] = useState(undefined)
  const [canPlay, setCanPlay] = useState(false)
  const [shouldRenderValue, setShouldRenderValue] = useState(true)
  const [filter, setFilter] = useState('')
  const [answer, setAnswer] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showBorder, setShowBorder] = useState(false)
  const [round, setRound] = useState(0)
  const [volume, setVolume] = useState(10)
  const [seekTo, setSeekTo] = useState(0)
  const [songDetails, setSongDetails] =
    useState<SongDetails>(EMPTY_SONG_DETAILS)

  useEffect(() => {
    socket.on('game:song', (url, seek) => {
      setGameState(State.BUFFERING)
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
      setShowBorder(true)
    })

    socket.on('game:finished', () => {
      setGameState(State.FINISHED)
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
    }
  }, [socket])

  useEffect(() => {
    if (gameState === State.ANSWERING) {
      socket.emit('game:answer', room.id, answer)
      setFilter('')
      setShouldRenderValue(true)
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
                  setGameState(State.ANSWERING)
                  setVideoUrl(undefined)
                  clearTimeout(timeout)
                }, (room.config.guessTime + 1) * 1000)
                setCountdown(room.config.guessTime)
                setGameState(State.PLAYING)
                setAnswer('')
                setSongDetails(EMPTY_SONG_DETAILS)
                setShowBorder(false)
                setRound((prevRound) => prevRound + 1)
              }}
            />
          </VisuallyHidden>
          <HStack
            w={'100%'}
            justifyContent={'space-around'}
            alignItems={'start'}
          >
            <Standings
              standings={room.players.map((player) => {
                return {
                  name: player.id,
                  score: player.score || 0
                }
              })}
            />
            <VStack w="520px" spacing={'24px'}>
              <AspectRatio w="100%" ratio={5 / 3}>
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
              <Box w={'90%'}>
                <Select
                  maxMenuHeight={175}
                  useBasicStyles
                  isReadOnly={gameState !== State.PLAYING}
                  placeholder="Enter game name..."
                  onChange={(value) => {
                    setShouldRenderValue(true)
                    setAnswer(value?.label || '')
                  }}
                  onInputChange={(value) => setFilter(value)}
                  inputValue={filter}
                  value={answer ? { value: answer, label: answer } : null}
                  focusBorderColor={
                    showBorder
                      ? isCorrect
                        ? 'green.500'
                        : 'red.500'
                      : 'blue.500'
                  }
                  isInvalid={showBorder}
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
                    if (gameState === State.PLAYING) setShouldRenderValue(false)
                  }}
                  onBlur={() => setShouldRenderValue(true)}
                />
              </Box>
            </VStack>
            <SongInfo name={songDetails.name} composer={songDetails.composer} />
          </HStack>
        </VStack>
      )}
    </>
  )
}
