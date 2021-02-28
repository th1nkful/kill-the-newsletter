import {
  Model, DataTypes, Sequelize, ModelStatic,
} from 'sequelize';

interface IModels {
  [key: string]: ModelStatic<Model<any>>;
}

export interface IItems {
  // id?: number;
  uid: string;
  title: string;
  description: string;
  guid: string;
  url: string;
  author?: string|null;
  date: Date;
  // createdAt?: Date;
  // updatedAt?: Date;
  // feedId?: number;
}

module.exports = (sequelize: Sequelize) => {
  class Items extends Model<IItems> {}

  Items.init({
    uid: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    guid: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('url');
      },
    },
    url: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
  });

  // @ts-ignore
  Items.associate = (models: IModels) => {
    const { Feeds } = models;

    Items.belongsTo(Feeds, {
      foreignKey: 'feedId',
      onDelete: 'cascade',
    });
  };

  return Items;
};
