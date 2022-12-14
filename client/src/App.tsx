import { ChakraProvider } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Rooms } from './pages/Rooms'

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="rooms" element={<Rooms />} />
      </Routes>
    </ChakraProvider>
  )
}

export default App
