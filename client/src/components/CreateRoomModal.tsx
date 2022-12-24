import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack
} from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'

type CreateRoomModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const CreateRoomModal = ({ isOpen, onClose }: CreateRoomModalProps) => {
  const navigate = useNavigate()
  const socket = useContext(SocketContext)
  const [roomName, setRoomName] = useState('')
  const [numberOfPlayers, setNumberOfPlayers] = useState('5')
  const [numberOfSongs, setNumberOfSongs] = useState('15')
  const [guessTime, setGuessTime] = useState('20')
  const isError = roomName === ''

  const createRoom = () => {
    socket.emit(
      'room:create',
      {
        name: roomName,
        config: {
          songs: parseInt(numberOfSongs),
          guessTime: parseInt(guessTime),
          capacity: parseInt(numberOfPlayers)
        }
      },
      (roomId: string) => {
        navigate(`/room/${roomId}`)
      }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setRoomName('')
        setNumberOfPlayers('5')
        setNumberOfSongs('15')
        setGuessTime('20')
        onClose()
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={isError}>
              <FormLabel>Room Name</FormLabel>
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              {isError && (
                <FormErrorMessage>Room name is required.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Number of Players</FormLabel>
              <NumberInput
                value={numberOfPlayers}
                onChange={(value) => setNumberOfPlayers(value)}
                isValidCharacter={(value) => Number.isInteger(+value)}
                defaultValue={5}
                min={1}
                max={10}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Number of Songs</FormLabel>
              <NumberInput
                value={numberOfSongs}
                onChange={(value) => setNumberOfSongs(value)}
                isValidCharacter={(value) => Number.isInteger(+value)}
                defaultValue={15}
                min={1}
                max={20}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Guess Time</FormLabel>
              <NumberInput
                value={guessTime}
                onChange={(value) => setGuessTime(value)}
                isValidCharacter={(value) => Number.isInteger(+value)}
                defaultValue={20}
                min={10}
                max={30}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            disabled={isError}
            onClick={() => {
              createRoom()
              setRoomName('')
              setNumberOfPlayers('5')
              setNumberOfSongs('15')
              setGuessTime('20')
              onClose()
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
