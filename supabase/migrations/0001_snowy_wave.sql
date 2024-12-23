/*
  # Sistema de votación - Tablas iniciales

  1. Nuevas Tablas
    - `questions`: Almacena las preguntas y sus opciones
      - `id` (uuid, clave primaria)
      - `options` (array de texto)
      - `votes` (array de números)
      - `created_at` (timestamp)
    - `votes`: Registro de votos por usuario
      - `id` (uuid, clave primaria)
      - `user_id` (texto)
      - `question_id` (referencia a questions)
      - `created_at` (timestamp)

  2. Seguridad
    - RLS habilitado en ambas tablas
    - Políticas para lectura y escritura
*/

-- Tabla de preguntas
CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  options text[] NOT NULL,
  votes integer[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabla de registro de votos
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  question_id uuid REFERENCES questions(id),
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Políticas para questions
CREATE POLICY "Cualquiera puede leer questions"
  ON questions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Solo admin puede crear questions"
  ON questions
  FOR INSERT
  TO authenticated
  USING (auth.role() = 'admin');

-- Políticas para votes
CREATE POLICY "Usuarios pueden ver sus propios votos"
  ON votes
  FOR SELECT
  TO public
  USING (auth.uid()::text = user_id);

CREATE POLICY "Usuarios pueden registrar votos"
  ON votes
  FOR INSERT
  TO public
  USING (true);