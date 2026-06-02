-- Visão Nobre — Schema Supabase (PostgreSQL)
-- Execute no SQL Editor do Supabase: https://supabase.com/dashboard

CREATE TABLE IF NOT EXISTS cursos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  idade_minima INT NOT NULL DEFAULT 16,
  imagem TEXT,
  ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS inscricoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  cpf TEXT NOT NULL,
  telefone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  curso_id TEXT NOT NULL REFERENCES cursos(id),
  data_inscricao TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (cpf, curso_id)
);

CREATE TABLE IF NOT EXISTS administradores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mensagens_contato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  data_envio TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO cursos (id, nome, descricao, idade_minima, imagem, ativo) VALUES
  ('barbeiro', 'Curso de Barbeiro', 'Aprenda técnicas profissionais de corte, barba e atendimento.', 16, 'assets/cursos/barbeiro.svg', TRUE),
  ('manicure', 'Curso de Manicure', 'Domine técnicas de manicure, pedicure e nail art.', 16, 'assets/cursos/manicure.svg', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Senha padrão: 123456 (SHA-256)
INSERT INTO administradores (nome, email, senha_hash) VALUES
  ('Administrador', 'admin@visaonobre.com.br', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92')
ON CONFLICT (email) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_inscricoes_curso ON inscricoes(curso_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_data ON inscricoes(data_inscricao DESC);
