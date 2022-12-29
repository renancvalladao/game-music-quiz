import {
  extendTheme,
  StyleFunctionProps,
  type ThemeConfig
} from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
}

const theme = extendTheme({
  config,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('gray.100', 'gray.900')(props)
      }
    })
  }
})

export default theme
