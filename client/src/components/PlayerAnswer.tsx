import { TriangleDownIcon } from '@chakra-ui/icons'
import { Avatar, Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'

type PlayerAnswerProps = {
  username: string
  answer: string
}

export const PlayerAnswer = ({ username, answer }: PlayerAnswerProps) => {
  return (
    <Flex flexDirection={'column'} alignItems={'center'}>
      <Box
        p={'1'}
        px={'2'}
        borderRadius={'md'}
        bg={useColorModeValue('gray.400', 'gray.600')}
        minW={'24'}
        maxW={'48'}
      >
        <Text align={'center'} fontWeight={'bold'}>
          {answer}
        </Text>
      </Box>
      <TriangleDownIcon color={useColorModeValue('gray.400', 'gray.600')} />
      <Avatar
        bg={useColorModeValue('gray.400', 'gray.600')}
        name={username}
        mb={'1'}
      />
      <Box
        py={'1'}
        px={'2'}
        borderRadius={'md'}
        bg={useColorModeValue('gray.400', 'gray.600')}
        minW={'24'}
        maxW={'36'}
      >
        <Text noOfLines={1} align={'center'} fontWeight={'bold'}>
          {username}
        </Text>
      </Box>
    </Flex>
  )
}
