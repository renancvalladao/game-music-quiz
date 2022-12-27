import { Stack, Textarea, useColorModeValue, VStack } from '@chakra-ui/react'
import { useContext, useEffect, useRef, useState } from 'react'
import { SocketContext } from '../context/SocketContext'
import { Message } from './Message'

type ChatMessage = {
  author: string
  content: string
}

type ChatProps = {
  room: Room
}

export const Chat = ({ room }: ChatProps) => {
  const socket = useContext(SocketContext)
  const messagesRef = useRef<HTMLDivElement>(null)
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [usernamesMap, setUsernamesMap] = useState<{ [key: string]: string }>(
    {}
  )

  useEffect(() => {
    const usernames: { [key: string]: string } = {}
    room.players.forEach((player) => {
      usernames[player.id] = player.username
    })
    setUsernamesMap(usernames)
  }, [room])

  useEffect(() => {
    socket.on('message:received', (playerId, message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { author: playerId, content: message }
      ])
    })

    return () => {
      socket.off('message:received')
    }
  }, [socket])

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Stack
      h={'calc(100vh - 64px)'}
      w={'500px'}
      bg={useColorModeValue('gray.50', 'gray.600')}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Stack w={'96%'} h={'99%'} justifyContent={'space-between'}>
        <VStack
          borderRadius={'md'}
          flexGrow={1}
          bg={useColorModeValue('gray.200', 'gray.800')}
          p={'2'}
          overflow={'auto'}
          sx={{
            '&::-webkit-scrollbar': {
              width: '4px'
            },
            '&::-webkit-scrollbar-track': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: useColorModeValue('purple.200', 'purple.800'),
              borderRadius: '24px'
            }
          }}
        >
          {messages.map((message, index) => (
            <Message
              key={index}
              author={usernamesMap[message.author]}
              content={message.content}
              isSelf={message.author === socket.playerId}
            />
          ))}
          <div ref={messagesRef} />
        </VStack>
        <Textarea
          bg={useColorModeValue('gray.200', 'gray.800')}
          placeholder="Write message..."
          resize={'none'}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (messageText === '') return
              socket.emit('message:send', room.id, messageText)
              setMessageText('')
            }
          }}
        />
      </Stack>
    </Stack>
  )
}
