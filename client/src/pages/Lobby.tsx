import { PlayerAvatar } from '../components/PlayerAvatar'
import { NavBar } from '../components/NavBar'

export const Lobby = () => {
  return (
    <>
      <NavBar />
      <PlayerAvatar name="Renan" isHost />
    </>
  )
}
