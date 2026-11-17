const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    name: "Tênis Nike Air Max Drip",
    category: "Tênis",
    brand: "Nike",
    price: 599.90,
    priceDiscount: 499.90,
    discount: 16,
    gender: "Masculino",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    description: "Tênis de alta performance com amortecimento avançado e design exclusivo streetwear."
  },
  {
    id: 2,
    name: "Headphones Wireless Pro Sound",
    category: "Headphones",
    brand: "Puma",
    price: 350.00,
    priceDiscount: 299.90,
    discount: 15,
    gender: "Unissex",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    description: "Fone de ouvido sem fio com cancelamento de ruído ativo e som estéreo de alta fidelidade."
  },
  {
    id: 3,
    name: "Camiseta Oversized Minimalist",
    category: "Camisetas",
    brand: "Adidas",
    price: 180.00,
    priceDiscount: 149.90,
    discount: 17,
    gender: "Unissex",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    description: "Camiseta em algodão egípcio com modelagem oversized e toque ultra macio."
  },
  {
    id: 4,
    name: "Calça Jogger Tech Fleece",
    category: "Calças",
    brand: "Nike",
    price: 320.00,
    priceDiscount: 279.90,
    discount: 12,
    gender: "Masculino",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    description: "Calça jogger confortável ideal para treinos e composições urbanas casuais."
  },
  {
    id: 5,
    name: "Boné Strapback Drip Classic",
    category: "Bonés",
    brand: "Balenciaga",
    price: 150.00,
    priceDiscount: 119.90,
    discount: 20,
    gender: "Unissex",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
    description: "Boné com aba curva, regulagem strapback de alta durabilidade e bordado exclusivo."
  }
];

app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'Drip Store API RESTful rodando com sucesso!' });
});

app.get('/api/products', (req, res) => {
  res.json({ success: true, count: products.length, data: products });
});

app.listen(PORT, () => {
  console.log(`[SERVER] Servidor rodando na porta ${PORT}`);
});
