const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let agendamentos = [];

app.post('/agendar', (req, res) => {
  const { nome, pet, data, hora, servico } = req.body;
  if (!nome || !pet || !data || !hora || !servico) {
    return res.status(400).json({ mensagem: "Preencha todos os campos." });
  }
  agendamentos.push({ nome, pet, data, hora, servico });
  console.log("Agendamento recebido:", { nome, pet, data, hora, servico });
  res.json({ mensagem: "Agendamento realizado com sucesso!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
