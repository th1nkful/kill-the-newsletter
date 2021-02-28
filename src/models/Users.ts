import {
  Model, DataTypes, Sequelize, ModelStatic,
} from 'sequelize';

interface IModels {
  [key: string]: ModelStatic<Model<any>>;
}

export interface IUsers {
  id: number;
  uid: string;
  name: string;
  email: string;
  // createdAt?: Date;
  // updatedAt?: Date;
}

module.exports = (sequelize: Sequelize) => {
  class Users extends Model<IUsers> {}

  Users.init({
    uid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
  });

  // @ts-ignore
  Users.associate = (models: IModels) => {
    const { Feeds } = models;

    Users.hasMany(Feeds, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
  };

  return Users;
};
