import { RepeatIcon, TimeIcon } from '@chakra-ui/icons'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Progress,
  Text,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

type RoomCardProps = {
  id: string
  name: string
  host: string
  players: Player[]
  playing: boolean
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
  playing,
  config
}: RoomCardProps) => {
  const navigate = useNavigate()
  const isFull = players.length === config.capacity

  return (
    <Card w="100%" bgColor={useColorModeValue('white', 'gray.700')}>
      <CardHeader>
        <Heading size="md">{name}</Heading>
        <Text>
          Host:{' '}
          {players.filter((player) => player.id === host)[0]?.username || ''}
        </Text>
        {playing ? (
          <Badge colorScheme="purple">Playing</Badge>
        ) : isFull ? (
          <Badge colorScheme="red">Full</Badge>
        ) : (
          <Badge colorScheme="green">Open</Badge>
        )}
      </CardHeader>
      <CardBody>
        <Progress
          borderRadius={'md'}
          size={'md'}
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
        <Button
          onClick={() => navigate(`/room/${id}`)}
          isDisabled={isFull || playing}
          colorScheme="blue"
        >
          Join
        </Button>
      </CardFooter>
    </Card>
  )
}
