import {
  Model, DataTypes, Sequelize, ModelStatic,
} from 'sequelize';

import config from '../config';

interface IModels {
  [key: string]: ModelStatic<Model<any>>;
}

const {
  emailDomain,
  baseUrl,
} = config;

export interface IFeeds {
  id: number;
  uid: string;
  title: string;
  description: string;
  url: string;
  siteUrl: string;
  email: string;
  imageUrl: string;
  pubDate: Date;
  // createdAt?: Date;
  // updatedAt?: Date;
  // userId?: number;
}

module.exports = (sequelize: Sequelize) => {
  class Feeds extends Model<IFeeds> {}

  Feeds.init({
    uid: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        const uid = this.getDataValue('uid');
        return `${baseUrl}/feeds/${uid}`;
      },
    },
    siteUrl: {
      type: DataTypes.VIRTUAL,
      get() {
        const uid = this.getDataValue('uid');
        return `${baseUrl}/feeds/${uid}`;
      },
    },
    email: {
      type: DataTypes.VIRTUAL,
      get() {
        const uid = this.getDataValue('uid');
        return `${uid}@${emailDomain}`;
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    pubDate: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
  });

  // @ts-ignore
  Feeds.associate = (models: IModels) => {
    const { Items, Users } = models;

    Feeds.hasMany(Items, {
      foreignKey: 'feedId',
      onDelete: 'cascade',
    });

    Feeds.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
  };

  return Feeds;
};
