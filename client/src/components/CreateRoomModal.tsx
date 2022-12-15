import {
  Button,
  FormControl,
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
import { useState } from 'react'

type CreateRoomModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const CreateRoomModal = ({ isOpen, onClose }: CreateRoomModalProps) => {
  const [roomName, setRoomName] = useState('')
  const [numberOfPlayers, setNumberOfPlayers] = useState('5')
  const [numberOfSongs, setNumberOfSongs] = useState('15')
  const [guessTime, setGuessTime] = useState('20')

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
            <FormControl>
              <FormLabel>Room Name</FormLabel>
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Number of Players</FormLabel>
              <NumberInput
                isValidCharacter={(value) => Number.isInteger(+value)}
                defaultValue={5}
                min={1}
                max={10}
              >
                <NumberInputField
                  value={numberOfPlayers}
                  onChange={(e) => setNumberOfPlayers(e.target.value)}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Number of Songs</FormLabel>
              <NumberInput
                isValidCharacter={(value) => Number.isInteger(+value)}
                defaultValue={15}
                min={1}
                max={20}
              >
                <NumberInputField
                  value={numberOfSongs}
                  onChange={(e) => setNumberOfSongs(e.target.value)}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Guess Time</FormLabel>
              <NumberInput
                isValidCharacter={(value) => Number.isInteger(+value)}
                defaultValue={20}
                min={10}
                max={60}
              >
                <NumberInputField
                  value={guessTime}
                  onChange={(e) => setGuessTime(e.target.value)}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" onClick={onClose}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
