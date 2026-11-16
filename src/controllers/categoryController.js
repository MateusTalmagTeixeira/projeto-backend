const { Category } = require('../models');

// GET /v1/category/search
const searchCategories = async (req, res) => {
  try {
    let { limit = 12, page = 1, fields, use_in_menu } = req.query;

    limit = parseInt(limit, 10);
    page = parseInt(page, 10);

    if (Number.isNaN(limit) || Number.isNaN(page) || (limit !== -1 && limit <= 0) || page <= 0) {
      return res.status(400).json({ message: 'Parâmetros de paginação inválidos' });
    }

    const where = {};
    if (use_in_menu !== undefined) {
      where.use_in_menu = use_in_menu === 'true' || use_in_menu === '1';
    }

    let attributes;
    if (fields) {
      attributes = fields.split(',').map((f) => f.trim());
    }

    const queryOptions = {
      where,
      attributes,
    };

    if (limit !== -1) {
      queryOptions.limit = limit;
      queryOptions.offset = (page - 1) * limit;
    }

    const { count, rows } = await Category.findAndCountAll(queryOptions);

    return res.status(200).json({
      data: rows,
      total: count,
      limit,
      page: limit === -1 ? 1 : page,
    });
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao buscar categorias', error: error.message });
  }
};

// GET /v1/category/:id
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      attributes: ['id', 'name', 'slug', 'use_in_menu'],
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao buscar categoria', error: error.message });
  }
};

// POST /v1/category
const createCategory = async (req, res) => {
  try {
    const { name, slug, use_in_menu = false } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name e slug são obrigatórios' });
    }

    const category = await Category.create({
      name,
      slug,
      use_in_menu,
    });

    return res.status(201).json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      use_in_menu: category.use_in_menu,
    });
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao cadastrar categoria', error: error.message });
  }
};

// PUT /v1/category/:id
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, use_in_menu } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name e slug são obrigatórios' });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await category.update({
      name,
      slug,
      ...(use_in_menu !== undefined ? { use_in_menu } : {}),
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao atualizar categoria', error: error.message });
  }
};

// DELETE /v1/category/:id
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await category.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao deletar categoria', error: error.message });
  }
};

module.exports = {
  searchCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
