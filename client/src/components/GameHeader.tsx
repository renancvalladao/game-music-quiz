import { Card, CardHeader, Heading, VStack } from '@chakra-ui/react'

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
    <Card h={'fit-content'} w={'64'} size={'sm'} align={'center'}>
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
