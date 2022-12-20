import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const NavBar = () => {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')}>
      <Flex h={16}>
        <Link to={'/rooms'}>Rooms</Link>
      </Flex>
    </Box>
  )
}
