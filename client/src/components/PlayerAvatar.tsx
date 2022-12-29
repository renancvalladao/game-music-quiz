import { Avatar, Flex, Text, useColorModeValue } from '@chakra-ui/react'

type PlayerAvatarProps = {
  name: string
  isHost: boolean
  isReady: boolean
}

export const PlayerAvatar = ({ name, isHost, isReady }: PlayerAvatarProps) => {
  const hostBackgroundColor = useColorModeValue('blue.300', 'blue.700')

  return (
    <Flex>
      <Avatar
        bg="gray.400"
        name={name}
        showBorder
        borderColor={isReady ? 'green.500' : ''}
        borderWidth={'medium'}
        size={'xl'}
      />
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
          bg={useColorModeValue('white', 'gray.700')}
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
