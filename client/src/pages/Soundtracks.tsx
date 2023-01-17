import { SearchIcon } from '@chakra-ui/icons'
import {
  Box,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  useColorModeValue
} from '@chakra-ui/react'
import { ChangeEvent, useEffect, useState } from 'react'
import { NavBar } from '../components/NavBar'
import { SoundtrackCard } from '../components/SountrackCard'

type GameInfo = {
  id: number
  name: string
  loaded: boolean
  songs?: {
    name: string
    video_url: string
  }[]
}

export const Soundtracks = () => {
  const [games, setGames] = useState<GameInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setIsLoading(true)
    fetch(`${process.env.REACT_APP_GMQ_SERVER}/games`)
      .then((resp) => resp.json())
      .then((data) => {
        setGames(
          data.map((game: { id: number; name: string }) => {
            return { ...game, loaded: false }
          })
        )
        setIsLoading(false)
      })
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(event.target.value)

  return (
    <>
      <NavBar />
      <Box px={64} pt={8} pb={8}>
        <InputGroup size={'md'} mb={8}>
          <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
          <Input
            _hover={{ bg: '' }}
            _focus={{ bg: useColorModeValue('white', 'gray.700') }}
            bgColor={useColorModeValue('white', 'gray.700')}
            variant={'filled'}
            value={searchValue}
            onChange={handleChange}
            placeholder="Search games..."
          />
        </InputGroup>
        {isLoading ? (
          <Center w={'100%'} pt={8}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Center>
        ) : (
          <SimpleGrid
            spacing={6}
            templateColumns="repeat(auto-fill, minmax(384px, 1fr))"
          >
            {games
              .filter((game) =>
                game.name
                  .toLocaleLowerCase()
                  .includes(searchValue.toLocaleLowerCase())
              )
              .map((game) => (
                <SoundtrackCard
                  key={game.name}
                  gameId={game.id}
                  gameName={game.name}
                  songs={game.songs || []}
                  loaded={game.loaded}
                  setSongs={(songs) => {
                    setGames((prevGames) => {
                      const selectedGame = prevGames.find(
                        (prevGame) => prevGame.id === game.id
                      )
                      if (!selectedGame) return prevGames
                      selectedGame.songs = songs
                      selectedGame.loaded = true
                      return [...prevGames]
                    })
                  }}
                />
              ))}
          </SimpleGrid>
        )}
      </Box>
    </>
  )
}
