'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
      username: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true,
      },
      imgPath: {
        type: DataTypes.STRING,
        defaultValue: 'default-image'
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
      },
      pwd: {
        type: DataTypes.STRING,
        allowNull: false
      }

  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};