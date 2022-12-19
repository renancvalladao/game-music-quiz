import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text
} from '@chakra-ui/react'

type SongInfoProps = {
  name: string
  composer: string
}

export const SongInfo = ({ name, composer }: SongInfoProps) => {
  return (
    <Card h={'fit-content'} w={'56'} size={'sm'} align={'center'}>
      <CardHeader pb={0}>
        <Heading size="md">Song Info</Heading>
      </CardHeader>
      <CardBody>
        <Stack alignItems={'center'}>
          <Heading size="sm">Name</Heading>
          <Text fontSize={'sm'}>{name}</Text>
          <Heading size="sm">Composer</Heading>
          <Text fontSize={'sm'}>{composer}</Text>
        </Stack>
      </CardBody>
    </Card>
  )
}
