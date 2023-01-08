import { MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  HStack,
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
    <Box bg={useColorModeValue('gray.700', 'gray.800')}>
      <Flex h={16} px={64} alignItems={'center'}>
        <Text
          fontSize={'3xl'}
          fontWeight={'semibold'}
          color={useColorModeValue('gray.200', 'gray.300')}
        >
          GMQ
        </Text>
        <HStack spacing={'10'} ml={20} flexGrow={'1'}>
          <Link
            fontSize={'md'}
            as={RouterLink}
            to={'/'}
            color={useColorModeValue('gray.300', 'gray.400')}
            fontWeight={'semibold'}
          >
            Home
          </Link>
          <Link
            fontSize={'md'}
            as={RouterLink}
            to={'/rooms'}
            color={useColorModeValue('gray.300', 'gray.400')}
            fontWeight={'semibold'}
          >
            Rooms
          </Link>
        </HStack>
        <Button mr={20} onClick={toggleColorMode} colorScheme={'blue'}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Button onClick={onOpen} colorScheme={'blue'}>
          <SettingsIcon />
        </Button>
        {isOpen && <SettingsModal isOpen={isOpen} onClose={onClose} />}
      </Flex>
    </Box>
  )
}
