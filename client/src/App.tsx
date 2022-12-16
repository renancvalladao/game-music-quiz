import { ChakraProvider } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import { SocketContextProvider } from './context/SocketContext'
import { Home } from './pages/Home'
import { InGame } from './pages/InGame'
import { Lobby } from './pages/Lobby'
import { Rooms } from './pages/Rooms'

function App() {
  return (
    <SocketContextProvider>
      <ChakraProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="room/:roomId" element={<Lobby />} />
          <Route path="game" element={<InGame />} />
        </Routes>
      </ChakraProvider>
    </SocketContextProvider>
  )
}

export default App
