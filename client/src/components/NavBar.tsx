import { MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { SettingsModal } from './SettingsModal'

export const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')}>
      <Flex h={16} px={64} alignItems={'center'}>
        <Text fontSize={'4xl'}>GMQ</Text>
        <HStack spacing={'10'} ml={20} flexGrow={'1'}>
          <Link as={RouterLink} to={'/'}>
            Home
          </Link>
          <Link as={RouterLink} to={'/rooms'}>
            Rooms
          </Link>
        </HStack>
        <Button mr={20} onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        <IconButton
          aria-label="Settings"
          icon={<SettingsIcon />}
          onClick={onOpen}
        />
        {isOpen && <SettingsModal isOpen={isOpen} onClose={onClose} />}
      </Flex>
    </Box>
  )
}
