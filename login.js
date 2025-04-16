const express = require('express');
const pool = require('./db');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', async (req, res) => {
  const { identificador, senha } = req.body;

  if (!identificador || !senha) {
    return res.status(400).json({ sucesso: false, mensagem: 'Identificador e senha são obrigatórios' });
  }

  try {
    const result = await pool.query(`
      SELECT * FROM usuarios 
      WHERE nome = $1 OR email = $1 OR telefone = $1
    `, [identificador]);

    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(401).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }

    const isPasswordCorrect = await bcrypt.compare(senha, usuario.senha);
    if (!isPasswordCorrect) {
      return res.status(401).json({ sucesso: false, mensagem: 'Senha incorreta' });
    }
    
    if (usuario.primeiro_login) {
      await pool.query(`
        UPDATE usuarios SET primeiro_login = FALSE WHERE id = $1
      `, [usuario.id]);

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Primeiro login detectado! Recompensa concedida 🎁',
        dados: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone
        }
      });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso.',
      dados: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor' });
  }
});

app.post('/register', async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({ sucesso: false, mensagem: 'Todos os campos são obrigatórios' });
  }

  try {
    const existingUser = await pool.query(
      `SELECT * FROM usuarios WHERE email = $1 OR telefone = $2 OR nome = $3`,
      [email, telefone, nome]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ sucesso: false, mensagem: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    await pool.query(`
      INSERT INTO usuarios (nome, email, telefone, senha, primeiro_login)
      VALUES ($1, $2, $3, $4, TRUE)
    `, [nome, email, telefone, hashedPassword]);

    res.status(201).json({ sucesso: true, mensagem: 'Usuário cadastrado com sucesso' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao registrar o usuário' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
