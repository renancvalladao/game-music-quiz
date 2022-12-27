import { Avatar, Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'

type MessageProps = {
  author: string
  content: string
  isSelf: boolean
}

export const Message = ({ author, content, isSelf }: MessageProps) => {
  return (
    <Flex w={'100%'} flexDir={isSelf ? 'row-reverse' : 'row'}>
      <Avatar name={author} size={'xs'} bg="gray.400" />
      <Box
        borderRadius={'md'}
        py={1}
        px={2}
        bg={useColorModeValue('gray.50', 'gray.600')}
        ml={isSelf ? 0 : 2}
        mr={isSelf ? 2 : 0}
      >
        <Text
          fontSize={'sm'}
          fontWeight={'bold'}
          align={isSelf ? 'end' : 'start'}
          wordBreak={'break-all'}
        >
          {author}
        </Text>
        <Text
          fontSize={'sm'}
          align={isSelf ? 'end' : 'start'}
          wordBreak={'break-all'}
        >
          {content}
        </Text>
      </Box>
    </Flex>
  )
}
