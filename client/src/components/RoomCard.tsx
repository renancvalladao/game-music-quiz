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

type RoomCardProps = {
  name: string
  host: string
  players: number
  config: {
    songs: number
    guessTime: number
    capacity: number
  }
}

export const RoomCard = ({ name, host, players, config }: RoomCardProps) => {
  const isFull = players === config.capacity

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
          value={(players / config.capacity) * 100}
          colorScheme={isFull ? 'green' : 'blue'}
        />
        <Text align={'center'}>
          {players}/{config.capacity} players
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
        <Button isDisabled={isFull}>Join</Button>
      </CardFooter>
    </Card>
  )
}
