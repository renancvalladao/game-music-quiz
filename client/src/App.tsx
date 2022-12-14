import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Rooms } from './pages/Rooms'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="rooms" element={<Rooms />} />
    </Routes>
  )
}

export default App
