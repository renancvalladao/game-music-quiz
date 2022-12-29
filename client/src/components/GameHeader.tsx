import {
  Card,
  CardHeader,
  Heading,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'

type GameHeaderProps = {
  totalSongs: number
  playedSongs: number
  gameTitle: string
}

export const GameHeader = ({
  totalSongs,
  playedSongs,
  gameTitle
}: GameHeaderProps) => {
  return (
    <Card
      h={'fit-content'}
      minW={'64'}
      size={'sm'}
      align={'center'}
      bgColor={useColorModeValue('white', 'gray.700')}
    >
      <CardHeader>
        <VStack>
          <Heading size="md">
            ({playedSongs}/{totalSongs})
          </Heading>
          <Heading size="md">{gameTitle}</Heading>
        </VStack>
      </CardHeader>
    </Card>
  )
}
