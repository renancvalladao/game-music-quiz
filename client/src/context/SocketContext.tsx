import { createContext, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

type PlayerSocket = Socket & { playerId?: string; username?: string }

type SocketContextProps = {
  children: React.ReactNode
}

const socket = io(process.env.SERVER || 'http://localhost:3001', {
  closeOnBeforeunload: false
}) as PlayerSocket

export const SocketContext = createContext<PlayerSocket>(socket)

export const SocketContextProvider = ({ children }: SocketContextProps) => {
  useEffect(() => {
    socket.on('socket:playerId', (playerId) => {
      socket.auth = { playerId, username: playerId }
      socket.playerId = playerId
      socket.username = playerId
    })

    socket.on('socket:username', (newUsername) => {
      socket.auth = { ...socket.auth, username: newUsername }
      socket.username = newUsername
    })

    return () => {
      socket.off('socket:playerId')
      socket.off('socket:username')
    }
  }, [])
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
