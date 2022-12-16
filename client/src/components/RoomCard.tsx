import { RepeatIcon, TimeIcon } from '@chakra-ui/icons'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Progress,
  Text,
  Tooltip
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

type RoomCardProps = {
  id: string
  name: string
  host: string
  players: string[]
  config: {
    songs: number
    guessTime: number
    capacity: number
  }
}

export const RoomCard = ({
  id,
  name,
  host,
  players,
  config
}: RoomCardProps) => {
  const navigate = useNavigate()
  const isFull = players.length === config.capacity

  return (
    <Card w="100%">
      <CardHeader>
        <Heading size="md">{name}</Heading>
        <Text>Host: {host}</Text>
      </CardHeader>
      <CardBody>
        <Progress
          borderRadius={'lg'}
          size={'lg'}
          value={(players.length / config.capacity) * 100}
          colorScheme={isFull ? 'green' : 'blue'}
        />
        <Text align={'center'}>
          {players.length}/{config.capacity} players
        </Text>
      </CardBody>
      <CardFooter alignItems={'center'} justify={'space-between'}>
        <Flex>
          <Tooltip hasArrow label={'Guess Time'} placement="top">
            <Flex alignItems={'center'}>
              <TimeIcon />
              <Text ml={1}>{config.guessTime}</Text>
            </Flex>
          </Tooltip>

          <Tooltip hasArrow label={'Number of Songs'} placement="top">
            <Flex alignItems={'center'} ml={6}>
              <RepeatIcon />
              <Text ml={1}>{config.songs}</Text>
            </Flex>
          </Tooltip>
        </Flex>
        <Button onClick={() => navigate(`/room/${id}`)} isDisabled={isFull}>
          Join
        </Button>
      </CardFooter>
    </Card>
  )
}
