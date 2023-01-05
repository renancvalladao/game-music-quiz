import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5
})

export const getRandomSong = async (): Promise<{
  game_name: string
  song_name: string
  song_composer: string
  song_video_url: string
  alternative_answers: string[]
}> => {
  const query = `
    SELECT 
      g.name as game_name, 
      s.name as song_name, 
      s.composer as song_composer, 
      s.video_url as song_video_url, 
      array (
        WITH games_from_equivalent_songs AS (
          SELECT 
            games.id, 
            games.name 
          FROM 
            songs 
            JOIN games ON games.id = songs.game_id 
          WHERE 
            songs.id IN (
              SELECT 
                song_id_2 
              FROM 
                equivalent_songs 
              WHERE 
                song_id_1 = s.id
            )
        ) 
        SELECT 
          games.name 
        FROM 
          equivalent_games EG 
          JOIN games on games.id = game_id_2 
        WHERE 
          EG.game_id_1 = g.id 
          OR EG.game_id_1 IN (
            SELECT 
              id 
            FROM 
              games_from_equivalent_songs
          ) 
        UNION 
        SELECT 
          name 
        FROM 
          games_from_equivalent_songs
      ) as alternative_answers 
    FROM 
      songs s 
      JOIN games g ON g.id = s.game_id 
    WHERE 
      s.game_id = (
        SELECT 
          id 
        FROM 
          games 
        ORDER BY 
          RANDOM() 
        LIMIT 
          1
      ) 
    ORDER BY 
      RANDOM() 
    LIMIT 
      1;
  `
  const client = await pool.connect()
  try {
    const { rows } = await client.query(query)
    return rows[0]
  } finally {
    client.release()
  }
}

export const getAllGames = async (): Promise<string[]> => {
  const query = `
    SELECT 
      name 
    FROM 
      games 
    ORDER BY 
      name;
  `
  const client = await pool.connect()
  try {
    const { rows } = await client.query(query)
    const gameNames = rows.map((row) => row.name)
    return gameNames
  } finally {
    client.release()
  }
}
