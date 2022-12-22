import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const NavBar = () => {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')}>
      <Flex h={16} px={64} alignItems={'center'}>
        <Text fontSize={'4xl'}>GMQ</Text>
        <HStack spacing={'10'} ml={20}>
          <Link to={'/'}>Home</Link>
          <Link to={'/rooms'}>Rooms</Link>
        </HStack>
      </Flex>
    </Box>
  )
}
