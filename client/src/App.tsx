import { ChakraProvider } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { InGame } from './pages/InGame'
import { Lobby } from './pages/Lobby'
import { Rooms } from './pages/Rooms'

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="room" element={<Lobby />} />
        <Route path="game" element={<InGame />} />
      </Routes>
    </ChakraProvider>
  )
}

export default App
