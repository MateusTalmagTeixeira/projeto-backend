const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { Product, Category, ProductImage, ProductOption } = require('../models');

// Auxiliar para salvar imagem base64 em public/media ou manter URL
const saveBase64Image = (content, type = 'image/png', productId) => {
  if (!content) return '';
  if (content.startsWith('http://') || content.startsWith('https://') || content.startsWith('/media/')) {
    return content;
  }

  const base64Data = content.replace(/^data:image\/\w+;base64,/, '');
  const ext = type.split('/')[1] || 'png';
  const fileName = `product-${productId}-${Date.now()}-${Math.round(Math.random() * 1e5)}.${ext}`;
  const mediaDir = path.join(__dirname, '../../public/media');

  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }

  fs.writeFileSync(path.join(mediaDir, fileName), base64Data, 'base64');
  return `/media/${fileName}`;
};

// Auxiliar para formatar o produto conforme contrato da API
const formatProduct = (product, fieldsArray = null, baseUrl = '') => {
  const plain = product.get({ plain: true });

  const formatted = {
    id: plain.id,
    enabled: Boolean(plain.enabled),
    name: plain.name,
    slug: plain.slug,
    stock: plain.stock,
    description: plain.description,
    price: plain.price,
    price_with_discount: plain.price_with_discount,
    category_ids: plain.categories ? plain.categories.map((c) => c.id) : [],
    images: plain.images
      ? plain.images.map((img) => ({
          id: img.id,
          content: img.path.startsWith('http') ? img.path : `${baseUrl}${img.path}`,
        }))
      : [],
    options: plain.options
      ? plain.options.map((opt) => ({
          id: opt.id,
          title: opt.title,
          shape: opt.shape,
          radius: opt.radius,
          type: opt.type,
          values: opt.values ? opt.values.split(',') : [],
        }))
      : [],
  };

  if (fieldsArray && fieldsArray.length > 0) {
    const filtered = {};
    fieldsArray.forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(formatted, f)) {
        filtered[f] = formatted[f];
      }
    });
    return filtered;
  }

  return formatted;
};

// GET /v1/product/search
const searchProducts = async (req, res) => {
  try {
    let {
      limit = 12,
      page = 1,
      fields,
      match,
      category_ids,
      'price-range': priceRange,
      option,
    } = req.query;

    limit = parseInt(limit, 10);
    page = parseInt(page, 10);

    if (Number.isNaN(limit) || Number.isNaN(page) || (limit !== -1 && limit <= 0) || page <= 0) {
      return res.status(400).json({ message: 'Parâmetros de paginação inválidos' });
    }

    const where = {};

    if (match) {
      where[Op.or] = [
        { name: { [Op.like]: `%${match}%` } },
        { description: { [Op.like]: `%${match}%` } },
      ];
    }

    if (priceRange) {
      const [minStr, maxStr] = priceRange.split('-');
      const min = parseFloat(minStr);
      const max = parseFloat(maxStr);
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        where.price = { [Op.between]: [min, max] };
      }
    }

    const include = [
      { model: Category, as: 'categories', attributes: ['id'], through: { attributes: [] } },
      { model: ProductImage, as: 'images' },
      { model: ProductOption, as: 'options' },
    ];

    if (category_ids) {
      const catIds = category_ids.split(',').map((id) => parseInt(id.trim(), 10)).filter((n) => !Number.isNaN(n));
      if (catIds.length > 0) {
        include[0].where = { id: { [Op.in]: catIds } };
      }
    }

    const products = await Product.findAll({
      where,
      include,
      distinct: true,
    });

    let filteredProducts = products;

    // Filtro por option[id]=val1,val2
    if (option && typeof option === 'object') {
      filteredProducts = filteredProducts.filter((prod) => {
        return Object.entries(option).every(([optId, optValuesStr]) => {
          const targetValues = String(optValuesStr).split(',').map((v) => v.trim());
          return prod.options.some((prodOpt) => {
            if (String(prodOpt.id) !== String(optId)) return false;
            const available = prodOpt.values.split(',').map((v) => v.trim());
            return targetValues.some((tv) => available.includes(tv));
          });
        });
      });
    }

    const total = filteredProducts.length;
    const paginated = limit === -1
      ? filteredProducts
      : filteredProducts.slice((page - 1) * limit, page * limit);

    const fieldsArray = fields ? fields.split(',').map((f) => f.trim()) : null;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const data = paginated.map((p) => formatProduct(p, fieldsArray, baseUrl));

    return res.status(200).json({
      data,
      total,
      limit,
      page: limit === -1 ? 1 : page,
    });
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
};

// GET /v1/product/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'categories', attributes: ['id'], through: { attributes: [] } },
        { model: ProductImage, as: 'images' },
        { model: ProductOption, as: 'options' },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return res.status(200).json(formatProduct(product, null, baseUrl));
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao buscar produto', error: error.message });
  }
};

// POST /v1/product
const createProduct = async (req, res) => {
  try {
    const {
      enabled = false,
      name,
      slug,
      use_in_menu = false,
      stock = 0,
      description = '',
      price,
      price_with_discount,
      category_ids = [],
      images = [],
      options = [],
    } = req.body;

    if (!name || !slug || price === undefined || price_with_discount === undefined) {
      return res.status(400).json({ message: 'Campos obrigatórios: name, slug, price e price_with_discount' });
    }

    const product = await Product.create({
      enabled,
      name,
      slug,
      use_in_menu,
      stock,
      description,
      price,
      price_with_discount,
    });

    if (Array.isArray(category_ids) && category_ids.length > 0) {
      await product.setCategories(category_ids);
    }

    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        const savedPath = saveBase64Image(img.content, img.type, product.id);
        await ProductImage.create({
          product_id: product.id,
          enabled: true,
          path: savedPath,
        });
      }
    }

    if (Array.isArray(options) && options.length > 0) {
      for (const opt of options) {
        const rawValues = opt.values || opt.value || [];
        const valuesStr = Array.isArray(rawValues) ? rawValues.join(',') : String(rawValues);
        const parsedRadius = opt.radius !== undefined ? parseInt(String(opt.radius).replace(/\D/g, ''), 10) || 0 : 0;

        await ProductOption.create({
          product_id: product.id,
          title: opt.title,
          shape: opt.shape || 'square',
          radius: parsedRadius,
          type: opt.type || 'text',
          values: valuesStr,
        });
      }
    }

    const created = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: 'categories', attributes: ['id'], through: { attributes: [] } },
        { model: ProductImage, as: 'images' },
        { model: ProductOption, as: 'options' },
      ],
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return res.status(201).json(formatProduct(created, null, baseUrl));
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao cadastrar produto', error: error.message });
  }
};

// PUT /v1/product/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      enabled,
      name,
      slug,
      use_in_menu,
      stock,
      description,
      price,
      price_with_discount,
      category_ids,
      images,
      options,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await product.update({
      ...(enabled !== undefined ? { enabled } : {}),
      ...(name !== undefined ? { name } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(use_in_menu !== undefined ? { use_in_menu } : {}),
      ...(stock !== undefined ? { stock } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(price_with_discount !== undefined ? { price_with_discount } : {}),
    });

    if (Array.isArray(category_ids)) {
      await product.setCategories(category_ids);
    }

    if (Array.isArray(images)) {
      for (const img of images) {
        if (img.id && img.deleted) {
          await ProductImage.destroy({ where: { id: img.id, product_id: product.id } });
        } else if (img.id && img.content) {
          const savedPath = saveBase64Image(img.content, img.type, product.id);
          await ProductImage.update({ path: savedPath }, { where: { id: img.id, product_id: product.id } });
        } else if (!img.id && img.content) {
          const savedPath = saveBase64Image(img.content, img.type, product.id);
          await ProductImage.create({ product_id: product.id, enabled: true, path: savedPath });
        }
      }
    }

    if (Array.isArray(options)) {
      for (const opt of options) {
        if (opt.id && opt.deleted) {
          await ProductOption.destroy({ where: { id: opt.id, product_id: product.id } });
        } else if (opt.id) {
          const rawValues = opt.values || opt.value;
          const updateData = {};
          if (opt.title !== undefined) updateData.title = opt.title;
          if (opt.shape !== undefined) updateData.shape = opt.shape;
          if (opt.type !== undefined) updateData.type = opt.type;
          if (opt.radius !== undefined) {
            updateData.radius = parseInt(String(opt.radius).replace(/\D/g, ''), 10) || 0;
          }
          if (rawValues !== undefined) {
            updateData.values = Array.isArray(rawValues) ? rawValues.join(',') : String(rawValues);
          }
          await ProductOption.update(updateData, { where: { id: opt.id, product_id: product.id } });
        } else if (!opt.id && opt.title) {
          const rawValues = opt.values || opt.value || [];
          const valuesStr = Array.isArray(rawValues) ? rawValues.join(',') : String(rawValues);
          const parsedRadius = opt.radius !== undefined ? parseInt(String(opt.radius).replace(/\D/g, ''), 10) || 0 : 0;
          await ProductOption.create({
            product_id: product.id,
            title: opt.title,
            shape: opt.shape || 'square',
            radius: parsedRadius,
            type: opt.type || 'text',
            values: valuesStr,
          });
        }
      }
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
};

// DELETE /v1/product/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await product.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao deletar produto', error: error.message });
  }
};

module.exports = {
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
