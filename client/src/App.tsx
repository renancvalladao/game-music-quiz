import { ChakraProvider } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import { SocketContextProvider } from './context/SocketContext'
import { Home } from './pages/Home'
import { Room } from './pages/Room'
import { Rooms } from './pages/Rooms'
import theme from './theme'

function App() {
  return (
    <SocketContextProvider>
      <ChakraProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="room/:roomId" element={<Room />} />
        </Routes>
      </ChakraProvider>
    </SocketContextProvider>
  )
}

export default App
