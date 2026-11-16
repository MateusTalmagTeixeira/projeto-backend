const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const ProductOption = require('./ProductOption');

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductOption, { foreignKey: 'product_id', as: 'options', onDelete: 'CASCADE' });
ProductOption.belongsTo(Product, { foreignKey: 'product_id' });

Product.belongsToMany(Category, {
  through: 'product_categories',
  foreignKey: 'product_id',
  otherKey: 'category_id',
  timestamps: false,
  as: 'categories',
});

Category.belongsToMany(Product, {
  through: 'product_categories',
  foreignKey: 'category_id',
  otherKey: 'product_id',
  timestamps: false,
  as: 'products',
});

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  ProductImage,
  ProductOption,
};
