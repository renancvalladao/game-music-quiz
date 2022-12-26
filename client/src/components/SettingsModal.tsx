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
  ModalOverlay
} from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { SocketContext } from '../context/SocketContext'

type CreateRoomModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal = ({ isOpen, onClose }: CreateRoomModalProps) => {
  const socket = useContext(SocketContext)
  const [username, setUsername] = useState(socket.username)
  const isError = username === ''

  const changeUsername = () => {
    socket.emit('username:change', username)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired isInvalid={isError}>
            <FormLabel>Username</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {isError && (
              <FormErrorMessage>Username can't be empty.</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            disabled={isError}
            onClick={() => {
              changeUsername()
              onClose()
            }}
          >
            Change
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
