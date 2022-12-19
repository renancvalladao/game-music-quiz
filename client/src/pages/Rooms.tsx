import { SearchIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  useDisclosure
} from '@chakra-ui/react'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { CreateRoomModal } from '../components/CreateRoomModal'
import { NavBar } from '../components/NavBar'
import { RoomCard } from '../components/RoomCard'
import { SocketContext } from '../context/SocketContext'

export const Rooms = () => {
  const socket = useContext(SocketContext)
  const [rooms, setRooms] = useState<Room[]>([])
  const [searchValue, setSearchValue] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    socket.emit('room:list', (res: { data: Room[] }) => {
      setRooms(res.data)
    })

    socket.on('room:created', (room: Room) => {
      setRooms((prevRooms) => [...prevRooms, room])
    })

    socket.on('room:joined', ({ roomId, playerId }) => {
      setRooms((prevRooms) => {
        prevRooms.forEach((room) => {
          if (room.id === roomId) {
            if (!room.players.some((player) => player.id === playerId)) {
              room.players.push({ id: playerId, ready: false })
            }
          }
        })

        return [...prevRooms]
      })
    })

    socket.on('room:started', (roomId) => {
      setRooms((prevRooms) => {
        prevRooms.forEach((room) => {
          if (room.id === roomId) {
            room.playing = true
          }
        })

        return [...prevRooms]
      })
    })

    return () => {
      socket.off('room:list')
      socket.off('room:created')
      socket.off('room:joined')
      socket.off('room:started')
    }
  }, [socket])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(event.target.value)

  return (
    <>
      <NavBar />
      <Box px={64} pt={8}>
        <Flex mb={8}>
          <Button onClick={onOpen} colorScheme={'green'} size={'lg'} mr={4}>
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
          templateColumns="repeat(auto-fill, minmax(384px, 1fr))"
        >
          {rooms
            .filter((room) =>
              room.name
                .toLocaleLowerCase()
                .includes(searchValue.toLocaleLowerCase())
            )
            .map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
        </SimpleGrid>
        <CreateRoomModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </>
  )
}
