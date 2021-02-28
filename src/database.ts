/* eslint-disable max-classes-per-file */
import 'dotenv/config';

import {
  Sequelize,
  Model,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  Optional,
  DataTypes,
} from 'sequelize';
import config from './config';

const {
  emailDomain,
  baseUrl,
} = config;

const {
  DATABASE_NAME = 'kill-the-newsletter',
  DATABASE_USER = 'root',
  DATABASE_PASS = 'letmein',
  DATABASE_HOST = 'localhost',
  DATABASE_PORT = '3306',
  DATABASE_DIALECT = 'mysql',
} = process.env;

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASS, {
  host: DATABASE_HOST,
  port: Number.parseInt(DATABASE_PORT, 10),
  // @ts-ignore
  dialect: DATABASE_DIALECT,
});

interface UserAttributes {
  id: number;
  uid: string;
  name: string;
  email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;

  public uid: string;

  public name: string;

  public email: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public getFeeds!: HasManyGetAssociationsMixin<Item>;

  public addFeeds!: HasManyAddAssociationMixin<Feed, number>;

  public hasFeeds!: HasManyHasAssociationMixin<Item, number>;

  public countFeeds!: HasManyCountAssociationsMixin;

  public readonly feeds?: Feed[];

  public static associations: {
    feeds: Association<User, Feed>;
  };
}

interface FeedAttributes {
  id: number;
  uid: string;
  title: string;
  description: string;
  url: string;
  siteUrl: string;
  email: string;
  imageUrl: string;
  pubDate: Date;
}

interface FeedCreationAttributes extends Optional<FeedAttributes, 'id'> {}

class Feed extends Model<FeedAttributes, FeedCreationAttributes> implements FeedAttributes {
  public id!: number;

  public uid: string;

  public title: string;

  public description: string;

  public url: string;

  public siteUrl: string;

  public email: string;

  public imageUrl: string;

  public pubDate: Date;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public getItems!: HasManyGetAssociationsMixin<Item>;

  public addItems!: HasManyAddAssociationMixin<Item, number>;

  public hasItems!: HasManyHasAssociationMixin<Item, number>;

  public countItems!: HasManyCountAssociationsMixin;

  public readonly items?: Item[];

  public static associations: {
    items: Association<Feed, Item>;
  };
}

interface ItemAttributes {
  id: number;
  uid: string;
  title: string;
  description: string;
  guid: string;
  url: string;
  author: string|null;
  date: Date;
  feedId: number|null;
}

interface ItemCreationAttributes extends Optional<ItemAttributes, 'id'> {}

class Item extends Model <ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  public id!: number;

  public uid: string;

  public title: string;

  public description: string;

  public url: string;

  public guid: string;

  public author: string|null;

  public date: Date;

  public feedId: number|null;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

Feed.init({
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

Item.init({
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

User.init({
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

User.hasMany(Feed, {
  foreignKey: 'userId',
  onDelete: 'cascade',
});

Feed.hasMany(Item, {
  foreignKey: 'feedId',
  onDelete: 'cascade',
});

Feed.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'cascade',
});

Item.belongsTo(Feed, {
  foreignKey: 'feedId',
  onDelete: 'cascade',
});

const db = {
  sequelize,
  Feeds: Feed,
  Items: Item,
  Users: User,
};

export default db;
