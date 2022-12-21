import { createContext, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

type PlayerSocket = Socket & { playerId?: string }

type SocketContextProps = {
  children: React.ReactNode
}

const socket = io(
  'https://gmq-server.onrender.com' || 'http://localhost:3001'
) as PlayerSocket

export const SocketContext = createContext<PlayerSocket>(socket)

export const SocketContextProvider = ({ children }: SocketContextProps) => {
  useEffect(() => {
    socket.on('player:id', (playerId) => {
      socket.auth = { playerId }
      socket.playerId = playerId
    })

    return () => {
      socket.off('player:id')
    }
  }, [])
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
