const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { identificador, senha } = req.body;

  try {
    const result = await pool.query(`
      SELECT * FROM usuarios 
      WHERE nome = $1 OR email = $1 OR telefone = $1
    `, [identificador]);

    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(401).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ sucesso: false, mensagem: 'Senha incorreta' });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
