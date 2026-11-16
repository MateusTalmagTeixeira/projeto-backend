const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/media', express.static('public/media'));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Digital Store API rodando!' });
});

app.use('/v1/user', userRoutes);
app.use('/v1/category', categoryRoutes);
app.use('/v1/product', productRoutes);

module.exports = app;
