import { Avatar, Flex, Text, useColorModeValue } from '@chakra-ui/react'

type PlayerAvatarProps = {
  name: string
  isHost: boolean
}

export const PlayerAvatar = ({ name, isHost }: PlayerAvatarProps) => {
  const hostBackgroundColor = useColorModeValue('blue.300', 'blue.700')

  return (
    <Flex>
      <Avatar size={'xl'} />
      <Flex direction={'column'} justifyContent={isHost ? 'start' : 'center'}>
        {isHost && (
          <Flex
            w={'32'}
            ml={-12}
            pl={6}
            h={6}
            bg={hostBackgroundColor}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Text fontSize={'md'} fontWeight={'semibold'} noOfLines={1}>
              Host
            </Text>
          </Flex>
        )}
        <Flex
          w={'56'}
          ml={-12}
          pl={14}
          pr={6}
          h={12}
          bg={useColorModeValue('gray.100', 'gray.900')}
          alignItems={'center'}
          justifyContent={'center'}
          borderRadius={10}
        >
          <Text fontSize={'xl'} fontWeight={'semibold'} noOfLines={1}>
            {name}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}