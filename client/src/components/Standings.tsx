import {
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Text
} from '@chakra-ui/react'

type StandingsProps = {
  standings: {
    id: string
    name: string
    score: number
  }[]
}

export const Standings = ({ standings }: StandingsProps) => {
  return (
    <Card h={'fit-content'} w={'56'} size={'sm'}>
      <CardHeader>
        <Center>
          <Heading size="md">Standings</Heading>
        </Center>
      </CardHeader>
      <CardBody>
        {standings.map((standing) => (
          <Text key={standing.id} noOfLines={1}>
            {standing.score} {standing.name}
          </Text>
        ))}
      </CardBody>
    </Card>
  )
}
