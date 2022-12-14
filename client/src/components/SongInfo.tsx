import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text
} from '@chakra-ui/react'

export const SongInfo = () => {
  return (
    <Card h={'fit-content'} w={'48'} size={'sm'} align={'center'}>
      <CardHeader pb={0}>
        <Heading size="md">Song Info</Heading>
      </CardHeader>
      <CardBody>
        <Stack alignItems={'center'}>
          <Heading size="sm">Name</Heading>
          <Text fontSize={'sm'}>The Secret of The Forest</Text>
          <Heading size="sm">Composer</Heading>
          <Text fontSize={'sm'}>Yasunori Mitsuda</Text>
        </Stack>
      </CardBody>
    </Card>
  )
}
