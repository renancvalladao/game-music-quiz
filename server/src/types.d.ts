type Room = {
  id: string
  name: string
  host: string
  players: Player[]
  playing: boolean
  round: number
  config: {
    songs: number
    guessTime: number
    capacity: number
  }
  song?: {
    gameTitle: string
    name: string
    composer: string
  }
}

type Player = {
  id: string
  username: string
  ready: boolean
  buffered: boolean
  answered: boolean
  score: number
  answer?: string
}

type Game = {
  details: {
    title: string
    composer: string
  }
  songs: {
    name: string
    url: string
  }[]
}
