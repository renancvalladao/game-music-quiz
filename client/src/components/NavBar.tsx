import { Box, Flex, useColorModeValue } from '@chakra-ui/react'

export const NavBar = () => {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')}>
      <Flex h={16}></Flex>
    </Box>
  )
}
