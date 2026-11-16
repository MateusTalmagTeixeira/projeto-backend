const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Digital Store API', () => {
  let token = '';
  let userId = null;
  let categoryId = null;
  let productId = null;

  it('POST /v1/user - Deve cadastrar usuário', async () => {
    const res = await request(app).post('/v1/user').send({
      firstname: 'Teste',
      surname: 'Usuario',
      email: 'teste@mail.com',
      password: '123@123',
      confirmPassword: '123@123',
    });
    expect(res.statusCode).toBe(201);
    userId = res.body.id;
  });

  it('GET /v1/user/:id - Deve obter usuário', async () => {
    const res = await request(app).get(`/v1/user/${userId}`);
    expect(res.statusCode).toBe(200);
  });

  it('POST /v1/user/token - Deve gerar JWT', async () => {
    const res = await request(app).post('/v1/user/token').send({
      email: 'teste@mail.com',
      password: '123@123',
    });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  it('POST /v1/category - Deve rejeitar sem token com 400', async () => {
    const res = await request(app).post('/v1/category').send({ name: 'Shoes', slug: 'shoes' });
    expect(res.statusCode).toBe(400);
  });

  it('CRUD /v1/category - Deve criar, listar e atualizar categoria', async () => {
    const createRes = await request(app)
      .post('/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Shoes', slug: 'shoes', use_in_menu: true });
    expect(createRes.statusCode).toBe(201);
    categoryId = createRes.body.id;

    const searchRes = await request(app).get('/v1/category/search?limit=-1');
    expect(searchRes.statusCode).toBe(200);

    const updateRes = await request(app)
      .put(`/v1/category/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Tênis', slug: 'tenis', use_in_menu: true });
    expect(updateRes.statusCode).toBe(204);
  });

  it('CRUD /v1/product - Deve criar, buscar, atualizar e deletar produto', async () => {
    const createRes = await request(app)
      .post('/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send({
        enabled: true,
        name: 'Produto Teste',
        slug: 'produto-teste',
        stock: 5,
        description: 'Descrição teste',
        price: 150,
        price_with_discount: 120,
        category_ids: [categoryId],
        images: [{ type: 'image/png', content: 'https://example.com/img.png' }],
        options: [{ title: 'Tamanho', shape: 'square', radius: '4px', type: 'text', values: ['P', 'M'] }],
      });
    expect(createRes.statusCode).toBe(201);
    productId = createRes.body.id;

    const getRes = await request(app).get(`/v1/product/${productId}`);
    expect(getRes.statusCode).toBe(200);

    const updateRes = await request(app)
      .put(`/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Produto Atualizado', price: 180 });
    expect(updateRes.statusCode).toBe(204);

    const deleteRes = await request(app)
      .delete(`/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.statusCode).toBe(204);
  });
});
