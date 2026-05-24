-- Ejecutar en el SQL Editor de Supabase antes de usar el leaderboard en la app.

CREATE OR REPLACE FUNCTION get_leaderboard(
  p_mode      text,
  p_game_type text DEFAULT NULL,
  p_limit     int  DEFAULT 5
)
RETURNS TABLE (
  rank          bigint,
  player_name   text,
  final_balance int,
  michi_level   int,
  good_choices  int,
  total_choices int,
  game_type     text,
  played_at     timestamptz
)
LANGUAGE sql
AS $$
  SELECT
    ROW_NUMBER() OVER (
      ORDER BY final_balance DESC, played_at ASC
    ) AS rank,
    player_name,
    final_balance,
    michi_level,
    good_choices,
    total_choices,
    game_type,
    played_at
  FROM scores
  WHERE mode = p_mode
    AND (p_game_type IS NULL OR game_type = p_game_type)
  ORDER BY final_balance DESC, played_at ASC
  LIMIT p_limit;
$$;
