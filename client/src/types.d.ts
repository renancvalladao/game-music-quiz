type Room = {
  id: string
  name: string
  host: string
  players: string[]
  playing: boolean
  config: {
    songs: number
    guessTime: number
    capacity: number
  }
}
