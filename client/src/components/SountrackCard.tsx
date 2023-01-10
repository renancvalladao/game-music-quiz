import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  InfoOutlineIcon
} from '@chakra-ui/icons'
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Collapse,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'

type Song = {
  name: string
  video_url: string
}

type SoundtrackCardProps = {
  gameId: number
  gameName: string
  loaded: boolean
  songs: Song[]
  setSongs: (songs: Song[]) => void
}

export const SoundtrackCard = ({
  gameId,
  gameName,
  loaded,
  songs,
  setSongs
}: SoundtrackCardProps) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Card
      w="100%"
      bgColor={useColorModeValue('white', 'gray.700')}
      h={'fit-content;'}
    >
      <CardHeader>
        <Heading size="md">{gameName}</Heading>
      </CardHeader>
      <Collapse in={isOpen} animateOpacity>
        <CardBody bg={useColorModeValue('gray.300', 'gray.600')}>
          <Box
            overflowY={'auto'}
            maxH={'116px'}
            sx={{
              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: useColorModeValue('blue.400', 'blue.600'),
                borderRadius: '4px'
              }
            }}
          >
            {songs.map((song) => (
              <Flex key={song.name} alignItems={'center'} py={1}>
                <Text>{song.name}</Text>
                <Link href={song.video_url} ml={2} isExternal>
                  <Flex alignItems={'center'}>
                    <ExternalLinkIcon />
                  </Flex>
                </Link>
              </Flex>
            ))}
          </Box>
        </CardBody>
      </Collapse>
      <CardFooter justifyContent={'space-between'} alignItems={'center'}>
        {loaded ? (
          <Tooltip hasArrow label={'Total songs'} placement="top">
            <Flex alignItems={'center'}>
              <InfoOutlineIcon />
              <Text ml={1}>{songs.length}</Text>
            </Flex>
          </Tooltip>
        ) : (
          <Tooltip hasArrow label={'Not loaded'} placement="top">
            <Flex alignItems={'center'}>
              <InfoOutlineIcon />
            </Flex>
          </Tooltip>
        )}
        <IconButton
          aria-label="Fetch soundtrack"
          icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          variant={'unstyled'}
          onClick={() => {
            if (loaded) {
              onToggle()
              return
            }
            fetch(`https://gmq-server.onrender.com/songs/${gameId}`)
              .then((resp) => resp.json())
              .then((data) => {
                setSongs(data)
                onToggle()
              })
          }}
        />
      </CardFooter>
    </Card>
  )
}
