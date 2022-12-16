import { createContext } from 'react'
import { io, Socket } from 'socket.io-client'

type SocketContextProps = {
  children: React.ReactNode
}

const socket = io('http://localhost:3001')

export const SocketContext = createContext<Socket>(socket)

export const SocketContextProvider = ({ children }: SocketContextProps) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
