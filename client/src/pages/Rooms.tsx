import { SearchIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid
} from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { NavBar } from '../components/NavBar'
import { RoomCard } from '../components/RoomCard'

const ROOMS = [
  {
    name: 'Room #1',
    host: 'Renan',
    players: 3,
    config: {
      songs: 20,
      guessTime: 20,
      capacity: 10
    }
  },
  {
    name: 'Room #2',
    host: 'Cendon',
    players: 2,
    config: {
      songs: 15,
      guessTime: 25,
      capacity: 5
    }
  },
  {
    name: 'Room #3',
    host: 'Cadu',
    players: 6,
    config: {
      songs: 5,
      guessTime: 30,
      capacity: 6
    }
  },
  {
    name: 'Room #4',
    host: 'Daniel',
    players: 2,
    config: {
      songs: 10,
      guessTime: 20,
      capacity: 3
    }
  }
]

export const Rooms = () => {
  const [searchValue, setSearchValue] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(event.target.value)

  return (
    <>
      <NavBar />
      <Box px={64} pt={14}>
        <Flex mb={8}>
          <Button colorScheme={'green'} size={'lg'} mr={4}>
            New
          </Button>
          <InputGroup size={'lg'}>
            <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
            <Input
              value={searchValue}
              onChange={handleChange}
              placeholder="Search rooms..."
            />
          </InputGroup>
        </Flex>
        <SimpleGrid
          spacing={6}
          columns={2}
          templateColumns="repeat(auto-fill, minmax(384px, 1fr))"
        >
          {ROOMS.filter((room) =>
            room.name
              .toLocaleLowerCase()
              .includes(searchValue.toLocaleLowerCase())
          ).map((room) => (
            <RoomCard {...room} />
          ))}
        </SimpleGrid>
      </Box>
    </>
  )
}
