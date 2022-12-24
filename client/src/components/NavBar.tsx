import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Text,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
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
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
      </Flex>
    </Box>
  )
}
