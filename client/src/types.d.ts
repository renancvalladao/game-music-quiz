type Room = {
  id: string
  name: string
  host: string
  players: Player[]
  playing: boolean
  config: {
    songs: number
    guessTime: number
    capacity: number
  }
}

type Player = {
  id: string
  username: string
  ready: boolean
  score?: number
  answer?: string
}
