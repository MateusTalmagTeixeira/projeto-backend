const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// GET /v1/user/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'firstname', 'surname', 'email'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
};

// POST /v1/user
const createUser = async (req, res) => {
  try {
    const { firstname, surname, email, password, confirmPassword } = req.body;

    if (!firstname || !surname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'As senhas não coincidem' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      surname,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
    });
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao cadastrar usuário', error: error.message });
  }
};

// PUT /v1/user/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, surname, email } = req.body;

    if (!firstname || !surname || !email) {
      return res.status(400).json({ message: 'Firstname, surname e email são obrigatórios' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await user.update({ firstname, surname, email });

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
};

// DELETE /v1/user/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await user.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao deletar usuário', error: error.message });
  }
};

// POST /v1/user/token
const generateToken = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao gerar token', error: error.message });
  }
};

module.exports = {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  generateToken,
};
