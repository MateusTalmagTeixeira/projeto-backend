require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false })
  .then(() => {
    console.log('Banco de dados sincronizado!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar no banco:', err);
  });
