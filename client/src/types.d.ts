type Room = {
  id: string
  name: string
  host: string
  players: string[]
  config: {
    songs: number
    guessTime: number
    capacity: number
  }
}
